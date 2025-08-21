import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { tr } from 'date-fns/locale';
import { weekDescriptions } from '../data/subjects';

export function generateStudyPlan(settings) {
  const { startDate, endDate, subjects, dayOffDays, customTopics = [] } = settings;
  
  // Tüm günleri oluştur
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Çalışma günlerini filtrele (Cuma ve Cumartesi hariç)
  const studyDays = allDays.filter(day => {
    const dayName = format(day, 'EEEE', { locale: tr });
    return !dayOffDays.includes(dayName);
  });

  // Konuları ağırlıklarına göre dağıt (özel konular dahil)
  const distributedSubjects = distributeSubjectsByWeight(subjects, studyDays.length, startDate, endDate, customTopics);
  
  // Haftalık planları oluştur
  const weeks = createWeeklyPlans(startDate, endDate, distributedSubjects, dayOffDays, customTopics);
  
  return {
    startDate,
    endDate,
    weeks,
    totalDays: allDays.length,
    studyDays: studyDays.length
  };
}

function distributeSubjectsByWeight(subjects, totalStudyDays, startDate, endDate, customTopics = []) {
  // 15 Eylül'e kadar olan günleri hesapla
  const september15 = new Date(2024, 8, 15);
  const normalEndDate = endDate > september15 ? september15 : endDate;
  const normalStudyDays = Math.floor((normalEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Toplam ağırlığı hesapla
  const totalWeight = subjects.reduce((sum, subject) => sum + subject.weight, 0);
  
  // Her konunun kaç saat çalışılacağını hesapla (günde 6 saat çalışma)
  const dailyStudyHours = 6;
  const totalStudyHours = normalStudyDays * dailyStudyHours;
  
  // Her konu için saat dağılımı
  const subjectHours = subjects.map(subject => ({
    subject,
    hours: Math.round((subject.weight / totalWeight) * totalStudyHours),
    topicHours: Math.round((subject.weight / totalWeight) * totalStudyHours / subject.topics.length)
  }));
  
  // Konuları ve alt konularını saatlerine göre günlere dağıt
  const distributed = [];
  subjectHours.forEach(({ subject, hours, topicHours }) => {
    const daysNeeded = Math.ceil(hours / dailyStudyHours);
    
    for (let day = 0; day < daysNeeded; day++) {
      const remainingHours = hours - (day * dailyStudyHours);
      const dayHours = Math.min(dailyStudyHours, remainingHours);
      
      if (dayHours > 0) {
        distributed.push({
          subject,
          hours: dayHours,
          topicHours
        });
      }
    }
  });
  
  // Özel konuları dağıtıma ekle
  customTopics.forEach(customTopic => {
    if (customTopic.type === 'daily' && customTopic.targetDate) {
      // Günlük özel konuları belirli tarihe ekle
      const targetDate = new Date(customTopic.targetDate);
      if (targetDate >= startDate && targetDate <= normalEndDate) {
        distributed.push({
          subject: {
            id: `custom-${customTopic.id}`,
            name: customTopic.subject,
            weight: customTopic.priority === 'high' ? 10 : customTopic.priority === 'medium' ? 7 : 4,
            topics: [customTopic.topic]
          },
          hours: 2, // Özel konular için 2 saat
          topicHours: 2,
          isCustom: true,
          customTopic: customTopic
        });
      }
    } else if (customTopic.type === 'weekly' && customTopic.targetWeek) {
      // Haftalık özel konuları hedef haftaya ekle
      let weekStart;
      
      if (customTopic.targetWeek === -1) {
        // 15-28 Eylül tekrar haftası
        weekStart = new Date(2024, 8, 15); // 15 Eylül
      } else {
        // Normal haftalar
        weekStart = new Date(startDate);
        weekStart.setDate(weekStart.getDate() + (customTopic.targetWeek - 1) * 7);
      }
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      if (weekStart <= normalEndDate) {
        distributed.push({
          subject: {
            id: `custom-week-${customTopic.id}`,
            name: customTopic.subject,
            weight: customTopic.priority === 'high' ? 10 : customTopic.priority === 'medium' ? 7 : 4,
            topics: [customTopic.topic]
          },
          hours: 3, // Haftalık özel konular için 3 saat
          topicHours: 3,
          isCustom: true,
          customTopic: customTopic,
          targetWeek: customTopic.targetWeek,
          weekStart: weekStart,
          weekEnd: weekEnd
        });
      }
    }
  });
  
  return distributed;
}

function createWeeklyPlans(startDate, endDate, distributedSubjects, dayOffDays, customTopics) {
  const weeks = [];
  let currentDate = new Date(startDate);
  let subjectIndex = 0;
  let weekNumber = 1;
  
  while (currentDate <= endDate) {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Pazar başlangıç
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const dailyPlans = [];
    
    weekDays.forEach(day => {
      const dayName = format(day, 'EEEE', { locale: tr });
      const isDayOff = dayOffDays.includes(dayName) || day < startDate || day > endDate;
      
      if (isDayOff) {
        dailyPlans.push({
          date: day,
          dayOfWeek: dayName,
          subjects: [],
          isDayOff: true
        });
              } else {
          // O gün için konuları seç
          const daySubjects = [];
          const subjectsPerDay = 3; // Günde 3 konu
          
          // Özel konuları kontrol et
          const customTopicsForDay = customTopics.filter(topic => {
            if (topic.type === 'daily') {
              const targetDate = new Date(topic.targetDate);
              return targetDate.toDateString() === day.toDateString();
            }
            return false;
          });
          
          // Özel konuları ekle
          customTopicsForDay.forEach(topic => {
            daySubjects.push({
              subject: {
                id: topic.id,
                name: topic.title,
                weight: topic.priority === 'high' ? 10 : topic.priority === 'medium' ? 7 : 4,
                topics: [topic.description]
              },
              topics: [topic.description],
              isCustom: true,
              priority: topic.priority
            });
          });
          
          // Normal konuları ekle (saat bazlı)
          let totalHoursForDay = 0;
          const dailyStudyHours = 6;
          
          // Önce özel konuları ekle (eğer bu gün için varsa)
          const customSubjectsForDay = distributedSubjects.filter(subjectData => {
            if (!subjectData.isCustom) return false;
            
            if (subjectData.customTopic.type === 'daily' && subjectData.customTopic.targetDate) {
              const targetDate = new Date(subjectData.customTopic.targetDate);
              return format(targetDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
            }
            
            if (subjectData.customTopic.type === 'weekly' && subjectData.targetWeek) {
              // Haftalık konular için doğru hafta hesaplama
              if (subjectData.weekStart && subjectData.weekEnd) {
                return day >= subjectData.weekStart && day <= subjectData.weekEnd;
              }
              
              // Fallback hesaplama
              let weekStart;
              if (subjectData.targetWeek === -1) {
                // 15-28 Eylül tekrar haftası
                weekStart = new Date(2024, 8, 15);
              } else {
                // Normal haftalar
                weekStart = new Date(startDate);
                weekStart.setDate(weekStart.getDate() + (subjectData.targetWeek - 1) * 7);
              }
              
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekEnd.getDate() + 6);
              return day >= weekStart && day <= weekEnd;
            }
            
            return false;
          });
          
          // Özel konuları güne ekle
          customSubjectsForDay.forEach(subjectData => {
            const availableHours = dailyStudyHours - totalHoursForDay;
            const subjectHours = Math.min(subjectData.hours || 2, availableHours);
            
            if (subjectHours > 0) {
              daySubjects.push({
                subject: subjectData.subject,
                topics: subjectData.subject.topics.map(topic => ({
                  topic: topic,
                  hours: subjectHours,
                  description: `${subjectData.subject.name} - ${topic}`
                })),
                hours: subjectHours,
                isCustom: true,
                priority: subjectData.customTopic.priority
              });
              
              totalHoursForDay += subjectHours;
            }
          });
          
          // Normal konuları ekle
          while (totalHoursForDay < dailyStudyHours && subjectIndex < distributedSubjects.length) {
            const subjectData = distributedSubjects[subjectIndex];
            
            // Özel konuları atla
            if (subjectData.isCustom) {
              subjectIndex++;
              continue;
            }
            
            const subject = subjectData.subject || subjectData;
            const availableHours = dailyStudyHours - totalHoursForDay;
            const subjectHours = Math.min(subjectData.hours || 2, availableHours);
            
            const topics = getTopicsForDay(subject, day, startDate, endDate, subjectData);
            
            daySubjects.push({
              subject,
              topics,
              hours: subjectHours,
              isScheduled: true
            });
            
            totalHoursForDay += subjectHours;
            
            // Eğer bu konunun saatleri bittiyse bir sonraki konuya geç
            if (subjectData.hours) {
              subjectData.hours -= subjectHours;
              if (subjectData.hours <= 0) {
                subjectIndex++;
              }
            } else {
              subjectIndex++;
            }
          }
        
        dailyPlans.push({
          date: day,
          dayOfWeek: dayName,
          subjects: daySubjects,
          isDayOff: false
        });
      }
    });
    
    // Haftalık özel konuları kontrol et ve hafta açıklamaları
    const september15 = new Date(2024, 8, 15);
    const september28 = new Date(2024, 8, 28);
    
    const weeklyCustomTopics = customTopics.filter(topic => {
      if (topic.type !== 'weekly') return false;
      
      // 15-28 Eylül arası tekrar haftası kontrolü
      if (topic.targetWeek === -1 && weekStart >= september15 && weekStart <= september28) return true;
      
      // Normal hafta kontrolü
      return topic.targetWeek === weekNumber;
    });
    
    // Hafta açıklamaları
    let description;
    if (weekStart >= september15 && weekStart <= september28) {
      description = 'Tekrar ve Deneme Haftası';
    } else {
      description = weekNumber <= weekDescriptions.length 
        ? weekDescriptions[weekNumber - 1] 
        : (() => {
            // Hafta numarasına göre açıklama
            const weekDescriptionsMap = {
              1: 'Başlangıç & Genel Tarama',
              2: 'Derinleşme',
              3: 'Alt Konuları Tamamlama',
              4: 'Genel Tekrar + Eksikler',
              5: 'Deneme Haftası',
              6: 'Son Hazırlık',
              7: 'Ek Çalışma',
              8: 'Ek Çalışma',
              9: 'Ek Çalışma',
              10: 'Ek Çalışma'
            };
            return weekDescriptionsMap[weekNumber] || 'Normal Çalışma Haftası';
          })();
    }
    
    // Haftalık özel konuları varsa açıklamaya ekle
    if (weeklyCustomTopics.length > 0) {
      description += ` + ${weeklyCustomTopics.length} Özel Konu`;
    }
    
    weeks.push({
      weekNumber,
      startDate: weekStart,
      endDate: weekEnd,
      days: dailyPlans,
      description
    });
    
    currentDate = addDays(weekEnd, 1);
    weekNumber++;
  }
  
  return weeks;
}

function getTopicsForDay(subject, day, startDate, endDate, subjectData) {
  // 15-28 Eylül arası tekrar haftası
  const september15 = new Date(2024, 8, 15); // 15 Eylül
  const september28 = new Date(2024, 8, 28); // 28 Eylül
  
  // 15-28 Eylül arası: Tekrar haftası
  if (day >= september15 && day <= september28) {
    // 28 Eylül sınav günü
    if (day.getDate() === 28 && day.getMonth() === 8) {
      return [{
        topic: 'SINAV GÜNÜ ⚖️',
        hours: 6,
        description: 'Avukatlık Sınavı'
      }];
    }
    
    const tekrarTopics = [
      'Medeni Hukuk Genel Tekrar',
      'Borçlar Hukuku Genel Tekrar', 
      'Ticaret Hukuku Genel Tekrar',
      'Ceza Hukuku Genel Tekrar',
      'Anayasa Hukuku Genel Tekrar',
      'İdare Hukuku Genel Tekrar',
      'Hukuk Usulü Genel Tekrar',
      '3s Deneme Sınavı (tam süre)',
      '3s Yanlışların Tekrarı',
      'Konu Testleri',
      'Hızlı Tekrar',
      'Özet Notlar',
      'Dinlenme + Hafif Tekrar'
    ];
    const dayIndex = Math.floor((day.getTime() - september15.getTime()) / (1000 * 60 * 60 * 24));
    return [{
      topic: tekrarTopics[dayIndex % tekrarTopics.length],
      hours: 6,
      description: 'Tekrar ve deneme çalışması'
    }];
  }
  
  // Normal dönem: Konuları ve alt konularını saat bazlı dağıt
  const september15EndDate = endDate > september15 ? september15 : endDate;
  const daysSinceStart = Math.floor((day.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalNormalDays = Math.floor((september15EndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (totalNormalDays <= 0) return [];
  
  // Alt konuları günlere dağıt
  const topicsWithHours = [];
  const totalSubjectHours = subjectData ? subjectData.hours : 6;
  const topicHours = subjectData ? subjectData.topicHours : Math.floor(6 / subject.topics.length);
  
  // Her alt konu için saat hesapla
  subject.topics.forEach((topic, index) => {
    const hoursForTopic = Math.max(1, topicHours);
    topicsWithHours.push({
      topic: topic,
      hours: hoursForTopic,
      description: `${subject.name} - ${topic}`
    });
  });
  
  // Günün hangi alt konusunu çalışacağını belirle
  const topicIndex = Math.floor((daysSinceStart / totalNormalDays) * subject.topics.length) % subject.topics.length;
  
  return [topicsWithHours[topicIndex] || {
    topic: subject.topics[0],
    hours: topicHours,
    description: `${subject.name} - ${subject.topics[0]}`
  }];
}

// Özel haftalar için plan oluşturma
export function createSpecialWeekPlan(weekNumber, startDate) {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(startDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  if (weekNumber === 5) {
    // Deneme haftası
    return weekDays.map(day => ({
      date: day,
      dayOfWeek: format(day, 'EEEE', { locale: tr }),
      subjects: [{
        subject: {
          id: 'deneme',
          name: 'Deneme Sınavı',
          weight: 10,
          topics: ['3s Deneme (tam sınav süresine uygun)', '3s Yanlışların Tekrarı']
        },
        topics: ['3s Deneme (tam sınav süresine uygun)', '3s Yanlışların Tekrarı']
      }],
      isDayOff: false
    }));
  } else if (weekNumber === 6) {
    // Son hazırlık haftası
    return weekDays.map((day, index) => {
      const dayName = format(day, 'EEEE', { locale: tr });
      const isDayOff = ['Cuma', 'Cumartesi'].includes(dayName);
      
      if (index === 5) { // 27 Eylül
        return {
          date: day,
          dayOfWeek: dayName,
          subjects: [{
            subject: {
              id: 'dinlenme',
              name: 'Dinlenme Günü',
              weight: 1,
              topics: ['Hafif gözden geçirme']
            },
            topics: ['Hafif gözden geçirme']
          }],
          isDayOff: false
        };
      } else if (index === 6) { // 28 Eylül
        return {
          date: day,
          dayOfWeek: dayName,
          subjects: [{
            subject: {
              id: 'sinav',
              name: 'SINAV GÜNÜ ⚖️',
              weight: 10,
              topics: ['Avukatlık Sınavı']
            },
            topics: ['Avukatlık Sınavı']
          }],
          isDayOff: false
        };
      }
      
      return {
        date: day,
        dayOfWeek: dayName,
        subjects: [{
          subject: {
            id: 'son-hazirlik',
            name: 'Son Hazırlık',
            weight: 8,
            topics: ['Hızlı tekrar (Medeni, Borçlar, Ticaret)', 'Küçük testler, özet notlar']
          },
          topics: ['Hızlı tekrar (Medeni, Borçlar, Ticaret)', 'Küçük testler, özet notlar']
        }],
        isDayOff: isDayOff
      };
    });
  }
  
  return [];
}
