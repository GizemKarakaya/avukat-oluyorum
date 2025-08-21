import React from 'react';
import {
  Box,
  Typography,
  Slider,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Alert
} from '@mui/material';

const SubjectWeightEditor = ({ subjects, onWeightChange }) => {
  const totalWeight = subjects.reduce((sum, subject) => sum + subject.weight, 0);

  const getWeightColor = (weight) => {
    if (weight >= 8) return 'error';
    if (weight >= 6) return 'warning';
    if (weight >= 4) return 'info';
    return 'primary';
  };

  const getWeightLabel = (weight) => {
    if (weight >= 8) return 'Çok Yüksek';
    if (weight >= 6) return 'Yüksek';
    if (weight >= 4) return 'Orta';
    return 'Düşük';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📊 Konu Ağırlık Düzenleyici
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          Konuların ağırlıklarını ayarlayarak çalışma planındaki dağılımı değiştirebilirsiniz. 
          Toplam ağırlık: <strong>{totalWeight}</strong>
        </Typography>
      </Alert>

      <Grid container spacing={2}>
        {subjects.map((subject) => (
          <Grid item xs={12} md={6} lg={4} key={subject.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {subject.name}
                  </Typography>
                  <Chip 
                    label={`${subject.weight}/10`}
                    color={getWeightColor(subject.weight)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {getWeightLabel(subject.weight)} Öncelik
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Slider
                    value={subject.weight}
                    onChange={(_, value) => onWeightChange(subject.id, value)}
                    min={1}
                    max={10}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                    color={getWeightColor(subject.weight)}
                  />
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="caption" color="text.secondary">
                  Alt Konular: {subject.topics.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SubjectWeightEditor;
