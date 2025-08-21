import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const TopicChecklist = ({ subjects }) => {
  const [checkedTopics, setCheckedTopics] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [showResetDialog, setShowResetDialog] = useState(false);

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    const saved = localStorage.getItem('avukatlik-checklist');
    if (saved) {
      try {
        setCheckedTopics(JSON.parse(saved));
      } catch (error) {
        console.error('Checklist verileri yüklenemedi:', error);
      }
    }
  }, []);

  // Değişiklikleri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('avukatlik-checklist', JSON.stringify(checkedTopics));
  }, [checkedTopics]);

  const handleTopicCheck = (subjectId, topicIndex, checked) => {
    setCheckedTopics(prev => ({
      ...prev,
      [`${subjectId}-${topicIndex}`]: checked
    }));
  };

  const handleSubjectToggle = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

  const getSubjectProgress = (subject) => {
    const totalTopics = subject.topics.length;
    const checkedCount = subject.topics.reduce((count, topic, index) => {
      return count + (checkedTopics[`${subject.id}-${index}`] ? 1 : 0);
    }, 0);
    return { checked: checkedCount, total: totalTopics, percentage: (checkedCount / totalTopics) * 100 };
  };

  const getTotalProgress = () => {
    const total = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
    const checked = Object.values(checkedTopics).filter(Boolean).length;
    return { checked, total, percentage: total > 0 ? (checked / total) * 100 : 0 };
  };

  const handleResetAll = () => {
    setCheckedTopics({});
    setShowResetDialog(false);
  };

  const handleExpandAll = () => {
    const newExpanded = {};
    subjects.forEach(subject => {
      newExpanded[subject.id] = true;
    });
    setExpandedSubjects(newExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedSubjects({});
  };

  const exportProgress = () => {
    const progressData = {
      exportDate: new Date().toISOString(),
      totalProgress: getTotalProgress(),
      subjects: subjects.map(subject => ({
        name: subject.name,
        weight: subject.weight,
        progress: getSubjectProgress(subject),
        topics: subject.topics.map((topic, index) => ({
          name: topic,
          completed: checkedTopics[`${subject.id}-${index}`] || false
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(progressData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avukatlik-sinavi-ilerleme-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalProgress = getTotalProgress();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          📋 Konu Takip Listesi
          <Chip 
            label={`${totalProgress.checked}/${totalProgress.total}`}
            color={totalProgress.percentage === 100 ? 'success' : 'primary'}
            variant="filled"
          />
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Genel İlerleme: {totalProgress.percentage.toFixed(1)}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={totalProgress.percentage} 
            sx={{ height: 8, borderRadius: 4 }}
            color={totalProgress.percentage === 100 ? 'success' : 'primary'}
          />
        </Box>

        {totalProgress.percentage === 100 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            🎉 Tebrikler! Tüm konuları tamamladınız! Artık sınava hazırsınız! ⚖️
          </Alert>
        )}

        {/* Kontrol Butonları */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleExpandAll}
          >
            Tümünü Aç
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleCollapseAll}
          >
            Tümünü Kapat
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<DownloadIcon />}
            onClick={exportProgress}
          >
            İlerlemeyi İndir
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            color="error"
            startIcon={<RefreshIcon />}
            onClick={() => setShowResetDialog(true)}
          >
            Sıfırla
          </Button>
        </Box>
      </Box>

      {/* Konu Listesi */}
      <Grid container spacing={2}>
        {subjects.map((subject) => {
          const progress = getSubjectProgress(subject);
          const isExpanded = expandedSubjects[subject.id];
          
          return (
            <Grid item xs={12} key={subject.id}>
              <Card elevation={2}>
                <Accordion 
                  expanded={isExpanded}
                  onChange={() => handleSubjectToggle(subject.id)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {progress.percentage === 100 ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <UncheckedIcon color="action" />
                        )}
                        <Typography variant="h6">
                          {subject.name}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ flex: 1, mx: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {progress.checked}/{progress.total}
                          </Typography>
                          <Chip 
                            label={`Ağırlık: ${subject.weight}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress.percentage} 
                          sx={{ height: 6, borderRadius: 3 }}
                          color={progress.percentage === 100 ? 'success' : 'primary'}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {progress.percentage.toFixed(0)}%
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  
                  <AccordionDetails>
                    <Box sx={{ pl: 2 }}>
                      {subject.topics.map((topic, index) => {
                        const isChecked = checkedTopics[`${subject.id}-${index}`] || false;
                        
                        return (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                checked={isChecked}
                                onChange={(e) => handleTopicCheck(subject.id, index, e.target.checked)}
                                color="primary"
                              />
                            }
                            label={
                              <Typography 
                                variant="body2"
                                sx={{ 
                                  textDecoration: isChecked ? 'line-through' : 'none',
                                  color: isChecked ? 'text.secondary' : 'text.primary'
                                }}
                              >
                                {topic}
                              </Typography>
                            }
                            sx={{ 
                              display: 'block', 
                              mb: 0.5,
                              '& .MuiFormControlLabel-label': {
                                fontSize: '0.875rem'
                              }
                            }}
                          />
                        );
                      })}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Sıfırlama Dialog */}
      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Tüm İlerlemeleri Sıfırla</DialogTitle>
        <DialogContent>
          <Typography>
            Tüm işaretlediğiniz konular sıfırlanacak. Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>İptal</Button>
          <Button onClick={handleResetAll} color="error" variant="contained">
            Sıfırla
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TopicChecklist;
