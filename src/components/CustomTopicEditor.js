import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const CustomTopicEditor = ({ customTopics, onCustomTopicsChange }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [newTopic, setNewTopic] = useState({
    id: '',
    subject: '',
    topic: '',
    subtopics: [],
    type: 'daily', // 'daily', 'weekly'
    targetDate: '',
    targetWeek: '',
    priority: 'medium' // 'low', 'medium', 'high'
  });

  const weekOptions = [
    { value: 1, label: '1. Hafta - Başlangıç & Genel Tarama' },
    { value: 2, label: '2. Hafta - Derinleşme' },
    { value: 3, label: '3. Hafta - Alt Konuları Tamamlama' },
    { value: 4, label: '4. Hafta - Genel Tekrar + Eksikler' },
    { value: 5, label: '5. Hafta - Deneme Haftası' },
    { value: 6, label: '6. Hafta - Son Hazırlık' },
    { value: 7, label: '7. Hafta - Ek Çalışma' },
    { value: 8, label: '8. Hafta - Ek Çalışma' },
    { value: 9, label: '9. Hafta - Ek Çalışma' },
    { value: 10, label: '10. Hafta - Ek Çalışma' },
    { value: -1, label: '15-28 Eylül - Tekrar ve Deneme Haftası' }
  ];

  const handleAddTopic = () => {
    setEditingTopic(null);
    setNewTopic({
      id: '',
      subject: '',
      topic: '',
      subtopics: [],
      type: 'daily',
      targetDate: '',
      targetWeek: '',
      priority: 'medium'
    });
    setOpenDialog(true);
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setNewTopic({ ...topic });
    setOpenDialog(true);
  };

  const handleDeleteTopic = (topicId) => {
    const updatedTopics = customTopics.filter(topic => topic.id !== topicId);
    onCustomTopicsChange(updatedTopics);
  };

  const handleSaveTopic = () => {
    if (!newTopic.subject.trim()) {
      alert('Konu adı boş olamaz!');
      return;
    }

    if (!newTopic.topic.trim()) {
      alert('Alt konu boş olamaz!');
      return;
    }

    if (newTopic.type === 'daily' && !newTopic.targetDate) {
      alert('Günlük konu için tarih seçmelisiniz!');
      return;
    }

    if (newTopic.type === 'weekly' && !newTopic.targetWeek) {
      alert('Haftalık konu için hafta seçmelisiniz!');
      return;
    }

    const updatedTopics = [...customTopics];
    
    if (editingTopic) {
      // Düzenleme
      const index = updatedTopics.findIndex(t => t.id === editingTopic.id);
      updatedTopics[index] = { ...newTopic };
    } else {
      // Yeni ekleme
      const newId = `custom-topic-${Date.now()}`;
      updatedTopics.push({
        ...newTopic,
        id: newId
      });
    }

    onCustomTopicsChange(updatedTopics);
    setOpenDialog(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return 'Orta';
    }
  };

  const getTypeLabel = (type) => {
    return type === 'daily' ? 'Günlük' : 'Haftalık';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const dailyTopics = customTopics.filter(topic => topic.type === 'daily');
  const weeklyTopics = customTopics.filter(topic => topic.type === 'weekly');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          📝 Özel Konu Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTopic}
        >
          Yeni Konu Ekle
        </Button>
      </Box>

      {/* Günlük Konular */}
      <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
        📅 Günlük Konular ({dailyTopics.length})
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {dailyTopics.map((topic) => (
          <Grid item xs={12} md={6} lg={4} key={topic.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {topic.subject}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditTopic(topic)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTopic(topic.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip 
                    label={getPriorityLabel(topic.priority)}
                    size="small"
                    color={getPriorityColor(topic.priority)}
                    variant="outlined"
                  />
                  <Chip 
                    label={getTypeLabel(topic.type)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {topic.topic}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  📅 {formatDate(topic.targetDate)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Haftalık Konular */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        📊 Haftalık Konular ({weeklyTopics.length})
      </Typography>
      <Grid container spacing={2}>
        {weeklyTopics.map((topic) => (
          <Grid item xs={12} md={6} lg={4} key={topic.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {topic.subject}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditTopic(topic)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTopic(topic.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip 
                    label={getPriorityLabel(topic.priority)}
                    size="small"
                    color={getPriorityColor(topic.priority)}
                    variant="outlined"
                  />
                  <Chip 
                    label={getTypeLabel(topic.type)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {topic.topic}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  📅 {weekOptions.find(w => w.value === topic.targetWeek)?.label || `Hafta ${topic.targetWeek}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Konu Ekleme/Düzenleme Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTopic ? 'Konu Düzenle' : 'Yeni Konu Ekle'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Konu Adı"
              value={newTopic.subject}
              onChange={(e) => setNewTopic(prev => ({ ...prev, subject: e.target.value }))}
              fullWidth
              required
              placeholder="Örn: Medeni Hukuk, Borçlar Hukuku"
            />
            
            <TextField
              label="Alt Konu"
              value={newTopic.topic}
              onChange={(e) => setNewTopic(prev => ({ ...prev, topic: e.target.value }))}
              fullWidth
              required
              placeholder="Örn: Kişiler Hukuku, Borcun Kaynağı"
            />
            
            <FormControl fullWidth>
              <InputLabel>Konu Türü</InputLabel>
              <Select
                value={newTopic.type}
                onChange={(e) => setNewTopic(prev => ({ ...prev, type: e.target.value }))}
                label="Konu Türü"
              >
                <MenuItem value="daily">Günlük Konu</MenuItem>
                <MenuItem value="weekly">Haftalık Konu</MenuItem>
              </Select>
            </FormControl>
            
            {newTopic.type === 'daily' && (
              <TextField
                label="Hedef Tarih"
                type="date"
                value={newTopic.targetDate}
                onChange={(e) => setNewTopic(prev => ({ ...prev, targetDate: e.target.value }))}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            )}
            
            {newTopic.type === 'weekly' && (
              <FormControl fullWidth>
                <InputLabel>Hedef Hafta</InputLabel>
                <Select
                  value={newTopic.targetWeek}
                  onChange={(e) => setNewTopic(prev => ({ ...prev, targetWeek: e.target.value }))}
                  label="Hedef Hafta"
                  required
                >
                  {weekOptions.map((week) => (
                    <MenuItem key={week.value} value={week.value}>
                      {week.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            <FormControl fullWidth>
              <InputLabel>Öncelik</InputLabel>
              <Select
                value={newTopic.priority}
                onChange={(e) => setNewTopic(prev => ({ ...prev, priority: e.target.value }))}
                label="Öncelik"
              >
                <MenuItem value="low">Düşük</MenuItem>
                <MenuItem value="medium">Orta</MenuItem>
                <MenuItem value="high">Yüksek</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<CancelIcon />}>
            İptal
          </Button>
          <Button 
            onClick={handleSaveTopic} 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={!newTopic.subject.trim() || !newTopic.topic.trim() || 
              (newTopic.type === 'daily' && !newTopic.targetDate) ||
              (newTopic.type === 'weekly' && !newTopic.targetWeek)}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomTopicEditor;
