import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  Collapse,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  School as SchoolIcon,
  BeachAccess as BeachIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const WeekRow = ({ week, isExpanded, onToggle }) => {
  return (
    <>
      <TableRow sx={{ backgroundColor: 'primary.light', '&:hover': { backgroundColor: 'primary.main' } }}>
        <TableCell>
          <IconButton size="small" onClick={onToggle}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="h6" color="white">
            {week.weekNumber}. Hafta
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1" color="white">
            {format(week.startDate, 'dd MMM', { locale: tr })} - {format(week.endDate, 'dd MMM yyyy', { locale: tr })}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1" color="white">
            {week.description}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1" color="white">
            {week.days.filter(day => !day.isDayOff).length} gün
          </Typography>
        </TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {week.days.map((day, dayIndex) => (
                  <Box sx={{ flex: '1 1 350px', minWidth: 0 }} key={dayIndex}>
                    <DayCard day={day} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const DayCard = ({ day }) => {
  const isToday = format(new Date(), 'yyyy-MM-dd') === format(day.date, 'yyyy-MM-dd');
  
  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%',
        border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
        backgroundColor: isToday ? '#f3f8ff' : 'white'
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {day.isDayOff ? (
            <BeachIcon color="disabled" sx={{ mr: 1 }} />
          ) : (
            <SchoolIcon color="primary" sx={{ mr: 1 }} />
          )}
          <Typography variant="h6" component="div">
            {format(day.date, 'dd MMM', { locale: tr })}
          </Typography>
          {isToday && (
            <Chip 
              label="Bugün" 
              size="small" 
              color="primary" 
              sx={{ ml: 1 }}
            />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {day.dayOfWeek}
        </Typography>
        
        {day.isDayOff ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <BeachIcon color="disabled" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Tatil
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            {day.subjects.map((subjectData, subjectIndex) => (
              <Box key={subjectIndex} sx={{ mb: 1 }}>
                <Chip 
                  label={subjectData.subject.name}
                  size="small"
                  color={subjectData.isCustom ? 'secondary' : 'primary'}
                  variant={subjectData.isCustom ? 'filled' : 'outlined'}
                  sx={{ mb: 0.5 }}
                />
                {subjectData.priority && (
                  <Chip 
                    label={subjectData.priority === 'high' ? 'Yüksek' : subjectData.priority === 'medium' ? 'Orta' : 'Düşük'}
                    size="small"
                    color={subjectData.priority === 'high' ? 'error' : subjectData.priority === 'medium' ? 'warning' : 'success'}
                    sx={{ ml: 0.5, mb: 0.5 }}
                  />
                )}
                {subjectData.topics.map((topic, topicIndex) => (
                  <Typography 
                    key={topicIndex} 
                    variant="caption" 
                    display="block"
                    sx={{ 
                      pl: 1, 
                      mt: 0.5,
                      fontSize: '0.75rem',
                      color: subjectData.isCustom ? 'secondary.main' : 'text.secondary',
                      fontWeight: subjectData.isCustom ? 'bold' : 'normal'
                    }}
                  >
                    • {typeof topic === 'object' ? topic.topic : topic}
                    {typeof topic === 'object' && topic.hours && (
                      <Chip 
                        label={`${topic.hours}s`}
                        size="small"
                        color="info"
                        variant="outlined"
                        sx={{ ml: 1, height: 16, fontSize: '0.6rem' }}
                      />
                    )}
                    {subjectData.hours && (
                      <Chip 
                        label={`${subjectData.hours}s`}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ ml: 1, height: 16, fontSize: '0.6rem' }}
                      />
                    )}
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const StudyPlanTable = ({ studyPlan }) => {
  const [expandedWeeks, setExpandedWeeks] = React.useState(new Set());

  const handleWeekToggle = (weekNumber) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          📅 Günlük Konu Planı ({format(studyPlan.startDate, 'dd MMM', { locale: tr })} – {format(studyPlan.endDate, 'dd MMM', { locale: tr })})
        </Typography>
        <Typography variant="body1">
          Toplam {studyPlan.weeks.length} hafta, {studyPlan.studyDays} çalışma günü
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell width={50}></TableCell>
              <TableCell>
                <Typography variant="h6">Hafta</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Tarih Aralığı</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Açıklama</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Çalışma Günü</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studyPlan.weeks.map((week) => (
              <WeekRow
                key={week.weekNumber}
                week={week}
                isExpanded={expandedWeeks.has(week.weekNumber)}
                onToggle={() => handleWeekToggle(week.weekNumber)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StudyPlanTable;
