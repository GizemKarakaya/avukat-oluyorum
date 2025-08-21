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
  Alert,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const SubjectEditor = ({ subjects, onSubjectsChange }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({
    id: '',
    name: '',
    weight: 5,
    topics: []
  });
  const [newTopic, setNewTopic] = useState('');

  const handleAddSubject = () => {
    setEditingSubject(null);
    setNewSubject({
      id: '',
      name: '',
      weight: 5,
      topics: []
    });
    setOpenDialog(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setNewSubject({ ...subject });
    setOpenDialog(true);
  };

  const handleDeleteSubject = (subjectId) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
    onSubjectsChange(updatedSubjects);
  };

  const handleSaveSubject = () => {
    if (!newSubject.name.trim()) {
      alert('Konu adı boş olamaz!');
      return;
    }

    if (newSubject.topics.length === 0) {
      alert('En az bir alt konu eklemelisiniz!');
      return;
    }

    const updatedSubjects = [...subjects];
    
    if (editingSubject) {
      // Düzenleme
      const index = updatedSubjects.findIndex(s => s.id === editingSubject.id);
      updatedSubjects[index] = { ...newSubject };
    } else {
      // Yeni ekleme
      const newId = `custom-${Date.now()}`;
      updatedSubjects.push({
        ...newSubject,
        id: newId
      });
    }

    onSubjectsChange(updatedSubjects);
    setOpenDialog(false);
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setNewSubject(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topicIndex) => {
    setNewSubject(prev => ({
      ...prev,
      topics: prev.topics.filter((_, index) => index !== topicIndex)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTopic();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          📚 Konu Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSubject}
        >
          Yeni Konu Ekle
        </Button>
      </Box>

      <Grid container spacing={2}>
        {subjects.map((subject) => (
          <Grid item xs={12} md={6} lg={4} key={subject.id}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {subject.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditSubject(subject)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSubject(subject.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Chip 
                  label={`Ağırlık: ${subject.weight}/10`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                
                <Typography variant="body2" color="text.secondary">
                  Alt Konular: {subject.topics.length}
                </Typography>
                
                <Box sx={{ mt: 1 }}>
                  {subject.topics.slice(0, 2).map((topic, index) => (
                    <Typography key={index} variant="caption" display="block" sx={{ fontSize: '0.75rem' }}>
                      • {topic}
                    </Typography>
                  ))}
                  {subject.topics.length > 2 && (
                    <Typography variant="caption" color="text.secondary">
                      +{subject.topics.length - 2} daha...
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Konu Ekleme/Düzenleme Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSubject ? 'Konu Düzenle' : 'Yeni Konu Ekle'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Konu Adı"
              value={newSubject.name}
              onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            
            <TextField
              label="Ağırlık (1-10)"
              type="number"
              value={newSubject.weight}
              onChange={(e) => setNewSubject(prev => ({ 
                ...prev, 
                weight: Math.min(10, Math.max(1, parseInt(e.target.value) || 1))
              }))}
              inputProps={{ min: 1, max: 10 }}
              fullWidth
            />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Alt Konular
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Yeni alt konu"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                  fullWidth
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTopic}
                  disabled={!newTopic.trim()}
                >
                  Ekle
                </Button>
              </Box>
              
              {newSubject.topics.map((topic, index) => (
                <Chip
                  key={index}
                  label={topic}
                  onDelete={() => handleRemoveTopic(index)}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<CancelIcon />}>
            İptal
          </Button>
          <Button 
            onClick={handleSaveSubject} 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={!newSubject.name.trim() || newSubject.topics.length === 0}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubjectEditor;
