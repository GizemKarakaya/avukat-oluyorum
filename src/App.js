import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Alert,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { subjects } from './data/subjects';
import { generateStudyPlan } from './utils/planGenerator';
import { exportToPDF, exportToCSV, exportToExcel } from './utils/exportUtils';
import StudyPlanTable from './components/StudyPlanTable';
import SubjectWeightEditor from './components/SubjectWeightEditor';
import SubjectEditor from './components/SubjectEditor';
import DayOffSelector from './components/DayOffSelector';
import CustomTopicEditor from './components/CustomTopicEditor';
import TopicChecklist from './components/TopicChecklist';

function App() {
  const [startDate, setStartDate] = useState(new Date(2024, 7, 19)); // 19 Ağustos 2024
  const [endDate, setEndDate] = useState(new Date(2024, 8, 28)); // 28 Eylül 2024
  const [studyPlan, setStudyPlan] = useState(null);
  const [customSubjects, setCustomSubjects] = useState(subjects);
  const [showWeightEditor, setShowWeightEditor] = useState(false);
  const [showSubjectEditor, setShowSubjectEditor] = useState(false);
  const [showDayOffSelector, setShowDayOffSelector] = useState(false);
  const [showCustomTopicEditor, setShowCustomTopicEditor] = useState(false);
  const [showTopicChecklist, setShowTopicChecklist] = useState(false);
  const [dayOffDays, setDayOffDays] = useState(['Cuma', 'Cumartesi']);
  const [customTopics, setCustomTopics] = useState([]);

  const generatePlan = () => {
    if (!startDate || !endDate) {
      alert('Lütfen başlangıç ve bitiş tarihlerini seçin.');
      return;
    }

    const settings = {
      startDate,
      endDate,
      includeWeekends: false,
      dayOffDays: dayOffDays,
      dailyStudyHours: 6,
      subjects: customSubjects,
      customTopics: customTopics
    };

    const plan = generateStudyPlan(settings);
    setStudyPlan(plan);
  };

  const handleExportPDF = async () => {
    if (!studyPlan) return;
    await exportToPDF(studyPlan, 'study-plan-table');
  };

  const handleExportCSV = () => {
    if (!studyPlan) return;
    exportToCSV(studyPlan);
  };

  const handleExportExcel = () => {
    if (!studyPlan) return;
    exportToExcel(studyPlan);
  };

  const updateSubjectWeight = (subjectId, newWeight) => {
    setCustomSubjects(prev => 
      prev.map(subject => 
        subject.id === subjectId 
          ? { ...subject, weight: newWeight }
          : subject
      )
    );
  };

  const updateSubjects = (newSubjects) => {
    setCustomSubjects(newSubjects);
  };

  const updateDayOffDays = (newDayOffDays) => {
    setDayOffDays(newDayOffDays);
  };

  const updateCustomTopics = (newCustomTopics) => {
    setCustomTopics(newCustomTopics);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
            ⚖️ Avukatlık Sınavı Çalışma Planı Generator
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
            Tarihi girdiğinde otomatik olarak günlere konuları dağıtır
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            📅 Plan Ayarları
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <DatePicker
                label="Başlangıç Tarihi"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <DatePicker
                label="Bitiş Tarihi"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={generatePlan}
                  startIcon={<CalendarIcon />}
                  size="large"
                  fullWidth
                >
                  Plan Oluştur
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowWeightEditor(!showWeightEditor)}
                  size="large"
                >
                  Ağırlık Düzenle
                </Button>
              </Stack>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowSubjectEditor(!showSubjectEditor)}
                size="medium"
              >
                📚 Konu Yönetimi
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowDayOffSelector(!showDayOffSelector)}
                size="medium"
              >
                🏖️ Tatil Günleri
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowCustomTopicEditor(!showCustomTopicEditor)}
                size="medium"
              >
                📝 Özel Konular
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowTopicChecklist(!showTopicChecklist)}
                size="medium"
              >
                📋 Konu Takip Listesi
              </Button>
            </Stack>
          </Box>

          {showWeightEditor && (
            <Box sx={{ mt: 3 }}>
              <SubjectWeightEditor
                subjects={customSubjects}
                onWeightChange={updateSubjectWeight}
              />
            </Box>
          )}

          {showSubjectEditor && (
            <Box sx={{ mt: 3 }}>
              <SubjectEditor
                subjects={customSubjects}
                onSubjectsChange={updateSubjects}
              />
            </Box>
          )}

          {showDayOffSelector && (
            <Box sx={{ mt: 3 }}>
              <DayOffSelector
                dayOffDays={dayOffDays}
                onDayOffDaysChange={updateDayOffDays}
              />
            </Box>
          )}

          {showCustomTopicEditor && (
            <Box sx={{ mt: 3 }}>
              <CustomTopicEditor
                customTopics={customTopics}
                onCustomTopicsChange={updateCustomTopics}
              />
            </Box>
          )}

          {showTopicChecklist && (
            <Box sx={{ mt: 3 }}>
              <TopicChecklist subjects={customSubjects} />
            </Box>
          )}
        </Paper>

        {studyPlan && (
          <>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                  📊 Plan Özeti
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="PDF İndir">
                    <IconButton onClick={handleExportPDF} color="primary">
                      <PdfIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excel İndir">
                    <IconButton onClick={handleExportExcel} color="primary">
                      <ExcelIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="CSV İndir">
                    <IconButton onClick={handleExportCSV} color="primary">
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Başlangıç Tarihi
                      </Typography>
                      <Typography variant="h6">
                        {format(studyPlan.startDate, 'dd MMM yyyy', { locale: tr })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Bitiş Tarihi
                      </Typography>
                      <Typography variant="h6">
                        {format(studyPlan.endDate, 'dd MMM yyyy', { locale: tr })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Toplam Gün
                      </Typography>
                      <Typography variant="h6">
                        {studyPlan.totalDays}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Çalışma Günü
                      </Typography>
                      <Typography variant="h6">
                        {studyPlan.studyDays}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Paper>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Not:</strong> {dayOffDays.length > 0 
                  ? `${dayOffDays.join(', ')} günleri tatil olarak işaretlenmiştir.`
                  : 'Tatil günü belirlenmemiştir.'
                } 
                Plan, konuların ağırlıklarına göre çalışma günlerine dağıtılmıştır.
              </Typography>
            </Alert>

            <Box id="study-plan-table">
              <StudyPlanTable studyPlan={studyPlan} />
            </Box>
          </>
        )}
      </Container>
    </LocalizationProvider>
  );
}

export default App;
