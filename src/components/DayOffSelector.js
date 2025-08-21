import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Alert,
  Stack,
  IconButton
} from '@mui/material';
import {
  BeachAccess as BeachIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const DayOffSelector = ({ dayOffDays, onDayOffDaysChange }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tempDayOffDays, setTempDayOffDays] = useState([...dayOffDays]);

  const allDays = [
    { key: 'Pazar', label: 'Pazar', icon: '🌅' },
    { key: 'Pazartesi', label: 'Pazartesi', icon: '📅' },
    { key: 'Salı', label: 'Salı', icon: '📅' },
    { key: 'Çarşamba', label: 'Çarşamba', icon: '📅' },
    { key: 'Perşembe', label: 'Perşembe', icon: '📅' },
    { key: 'Cuma', label: 'Cuma', icon: '🏖️' },
    { key: 'Cumartesi', label: 'Cumartesi', icon: '🏖️' }
  ];

  const handleDayToggle = (dayKey) => {
    setTempDayOffDays(prev => {
      if (prev.includes(dayKey)) {
        return prev.filter(day => day !== dayKey);
      } else {
        return [...prev, dayKey];
      }
    });
  };

  const handleSave = () => {
    onDayOffDaysChange(tempDayOffDays);
    setOpenDialog(false);
  };

  const handleCancel = () => {
    setTempDayOffDays([...dayOffDays]);
    setOpenDialog(false);
  };

  const getDayColor = (dayKey) => {
    return dayOffDays.includes(dayKey) ? 'error' : 'default';
  };

  const getDayVariant = (dayKey) => {
    return dayOffDays.includes(dayKey) ? 'filled' : 'outlined';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          🏖️ Tatil Günleri
        </Typography>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Düzenle
        </Button>
      </Box>

      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {allDays.map((day) => (
              <Chip
                key={day.key}
                label={`${day.icon} ${day.label}`}
                color={getDayColor(day.key)}
                variant={getDayVariant(day.key)}
                icon={dayOffDays.includes(day.key) ? <BeachIcon /> : null}
              />
            ))}
          </Box>
          
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Seçili tatil günleri:</strong> {dayOffDays.length > 0 
                ? dayOffDays.map(day => allDays.find(d => d.key === day)?.label).join(', ')
                : 'Tatil günü seçilmedi'
              }
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Tatil Günleri Düzenleme Dialog */}
      <Dialog open={openDialog} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          Tatil Günleri Belirle
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info">
              Çalışma planında tatil olarak işaretlenecek günleri seçin.
            </Alert>
            
            {allDays.map((day) => (
              <FormControlLabel
                key={day.key}
                control={
                  <Checkbox
                    checked={tempDayOffDays.includes(day.key)}
                    onChange={() => handleDayToggle(day.key)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{day.icon}</span>
                    <Typography>{day.label}</Typography>
                    {tempDayOffDays.includes(day.key) && <BeachIcon color="primary" />}
                  </Box>
                }
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} startIcon={<CancelIcon />}>
            İptal
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            startIcon={<SaveIcon />}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DayOffSelector;
