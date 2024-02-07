import React, { useState } from 'react';
import Axios from 'axios';
import {
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  styled,
} from '@mui/material';
import {
  WiDaySunny,
  WiDayCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiCloud,
  WiDust
} from 'react-icons/wi';

const BackgroundContainer = styled('div')({
  backgroundColor: '#87CEEB',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: theme => theme.spacing(4),
});

const StyledPaper = styled(Paper)(({ theme, weatherType }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  borderRadius: 16,
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
  width: '70%',
  maxWidth: 400,
  background: getBackgroundColor(theme, weatherType),
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const useStyles = {
  icon: {
    fontSize: 120,
    marginBottom: theme => theme.spacing(2),
  },
  formPaper: {
    padding: theme => theme.spacing(4),
    marginBottom: theme => theme.spacing(4),
    textAlign: 'center',
    borderRadius: 16,
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
    width: '70%',
    maxWidth: 400,
  },
  button: {
    marginTop: theme => theme.spacing(2),
  },
};

const LoadingIndicator = () => <CircularProgress size={24} color="inherit" />;

const WeatherIcon = ({ description }) => {
  const getWeatherIcon = () => {
    switch (description.toLowerCase()) {
      case 'clear':
        return <WiDaySunny style={useStyles.icon} />;
      case 'clouds':
        return <WiDayCloudy style={useStyles.icon} />;
      case 'rain':
        return <WiRain style={useStyles.icon} />;
      case 'snow':
        return <WiSnow style={useStyles.icon} />;
      case 'thunderstorm':
        return <WiThunderstorm style={useStyles.icon} />;
      case 'mist':
        return <WiCloud style={useStyles.icon} />;
      case 'haze':
        return <WiDust style={useStyles.icon} />; // Use WiDust for haze weather (as a placeholder)
      default:
        return null;
    }
  };

  return getWeatherIcon();
};


const WeatherDisplay = ({ city, weatherData }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  return (
    <StyledPaper weatherType={weatherData.description}>
      <Typography variant="h5" gutterBottom>
        {city} Weather
      </Typography>
      <WeatherIcon description={weatherData.description} />
      <Typography variant="h6">Temperature: {weatherData.temperature}°C</Typography>
      <Typography variant="body1">Description: {weatherData.description}</Typography>
      <Typography variant="body2" color="textSecondary">
        {formattedDate} | {formattedTime}
      </Typography>
    </StyledPaper>
  );
};

const WeatherForm = ({ inputCity, setInputCity, handleSearch, loading }) => (
  <StyledPaper style={useStyles.formPaper}>
    <TextField
      fullWidth
      label="Enter City"
      variant="outlined"
      value={inputCity}
      onChange={(e) => setInputCity(e.target.value)}
      style={{ marginBottom: '16px' }}
    />
    <Button
      variant="contained"
      color="primary"
      onClick={handleSearch}
      disabled={loading}
      style={useStyles.button}
    >
      {loading ? <LoadingIndicator /> : 'Search'}
    </Button>
  </StyledPaper>
);

const getBackgroundColor = (theme, weatherType) => {
  if (weatherType) {
    switch (weatherType.toLowerCase()) {
      case 'clear':
        return '#FFD54F';
      case 'clouds':
        return '#B0BEC5';
      case 'rain':
        return '#64B5F6';
      case 'snow':
        return '#E1F5FE';
      case 'thunderstorm':
        return '#9575CD';
      case 'mist':
        return '#E0E0E0';
      case 'haze':
        return '#D7CCC8'; // Example color for haze weather
      default:
        return theme.palette.background.default;
    }
  }
  return theme.palette.background.default;
};


const generateTemperature = (description) => {
  switch (description.toLowerCase()) {
    case 'sunny':
      return Math.floor(Math.random() * 15) + 20;
    case 'cloudy':
      return Math.floor(Math.random() * 10) + 15;
    case 'rainy':
      return Math.floor(Math.random() * 5) + 10;
    case 'snowy':
      return Math.floor(Math.random() * 5);
    case 'thunderstorm':
      return Math.floor(Math.random() * 10) + 15;
    default:
      return Math.floor(Math.random() * 30) + 10;
  }
};

const WeatherApp = () => {
  const [inputCity, setInputCity] = useState('');
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!inputCity.trim()) {
        return;
      }

     /* const response = await Axios.get(https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=17bbb9fa59efee2a8ca069c445945be4);
      const currentWeather = response.data;*/
      const response = await Axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=17bbb9fa59efee2a8ca069c445945be4`);
const currentWeather = response.data;


      const liveWeatherData = {
        temperature: Math.round(currentWeather.main.temp - 273.15),
        description: currentWeather.weather[0].main,
      };

      setWeatherData(liveWeatherData);
      setCity(inputCity);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Invalid city. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <BackgroundContainer>
      <Typography variant="h2" align="center" gutterBottom>
        Weather App
      </Typography>
      <WeatherForm inputCity={inputCity} setInputCity={setInputCity} handleSearch={handleSearch} loading={loading} />

      {weatherData && <WeatherDisplay city={city} weatherData={weatherData} />}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </BackgroundContainer>
  );
};

export default WeatherApp;