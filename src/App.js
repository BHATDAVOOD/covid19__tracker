import React,{useState,useEffect} from 'react';
import './App.css';
import {
  MenuItem,FormControl,Select,Card,CardContent
} from '@material-ui/core';

import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData,prettyPrintStat} from "./util";
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType,setCasesType] = useState("cases");


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) =>{
      setCountryInfo(data);
    })
  },[]);


  useEffect(()=>{
    // Create an asyn request and why? 
    // Async because we send a request, then wait for it and then do something with the information

    const getCountriesData = async()=>{
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country)=>({
          name: country.country,
          value: country.countryInfo.iso2
        }));

        const sortedData=sortData(data);

        setCountries(countries);
        setTableData(sortedData);
        setMapCountries(data);
      })
    }

    getCountriesData();

  },[]);

  const onCountryChange = async(event) => {
    const countryCode = event.target.value;
 
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' 
                                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setCountry(countryCode);
      // All the data from the Country
      setCountryInfo(data);
      //Set Map Center when country is selected in dropdown
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      // console.log(setMapCenter);
      // console.log("lat:" +data.countryInfo.lat +" lon:" +data.countryInfo.long);
      setMapZoom(5);
    });
  }

  return (
    <div className="app">
    <div className="app__left">
    {/* Header */}
    {/* Title + Select Box */}
    <div className="app__header">
    <h1>COVID-19 TRACKER</h1>
    <FormControl className="app__dropdown">
    <Select variant="outlined" onChange={onCountryChange} value={country}>
    {/* Loop through all the countries and list them as dropdown */}
      {/* <MenuItem value="worldwide">Worldwide</MenuItem>
      <MenuItem value="worldwide">India</MenuItem>
      <MenuItem value="worldwide">Pakistan</MenuItem>
      <MenuItem value="worldwide">China</MenuItem> */}
      <MenuItem value="worldwide">Worldwide</MenuItem>
      {countries.map((country) =>(
        <MenuItem value={country.value}>{country.name}</MenuItem>
      ))}
    </Select>
    </FormControl>
    </div>
    {/* End of Header */}
  
  
  <div className="app__stats">
  {/* InfoBox1 */}
  <InfoBox  
    onClick={(e) =>setCasesType("cases")}
    title="Coronavirus Cases" 
    isRed
    active={casesType === "cases"}
    cases={prettyPrintStat(countryInfo.todayCases)} 
    total={prettyPrintStat(countryInfo.cases)}/>
  
  {/* InfoBox2 */}
  <InfoBox  
    onClick={(e) =>setCasesType("recovered")}
    title="Recovered" 
    active={casesType === "recovered"}
    cases={prettyPrintStat(countryInfo.todayRecovered)} 
    total={prettyPrintStat(countryInfo.recovered)}/>

  {/* InfoBox3 */}
  <InfoBox  
    onClick={(e) =>setCasesType("deaths")}
    title="Deaths"
    isRed
    active={casesType === "deaths"} 
    cases={prettyPrintStat(countryInfo.todayDeaths)} 
    total={prettyPrintStat(countryInfo.deaths)}/>
  </div>

  

  {/* Map */}
  <Map 
    casesType={casesType}
    countries={mapCountries}
    center={mapCenter}
    zoom={mapZoom}
  />

  {/* ----------------------------Side Bar-------------------------------------------- */}
    </div>
    <Card className="app__right">
    <CardContent>
        
        {/* Table */}
        <h3>Live Cases by Country</h3>
        <Table countries={tableData} />
        {/* Graph */}
        <h3>Worldwide new {casesType}</h3>
        <LineGraph casesType={casesType}/>
    </CardContent>
    </Card>
    </div>
  );
}

export default App;
