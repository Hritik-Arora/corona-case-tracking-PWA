import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Table } from 'react-bootstrap';

interface ICovidData {
  [key: string]: {
    state: string,
    activeCases: string,
    cured: string,
    deaths: string, 
  }
}

interface ITotalCasesData {
  totalActiveCases: number;
  totalCured: number;
  totalDeaths: number;
}
function App() {
  const isNetworkDataReceived = useRef(false);
  const [covidData, setCovidData] = useState<ICovidData>({});
  const [totalcasesData, setTotalCasesData] = useState<ITotalCasesData | null>(null);

  const getAndSetDataInState = useCallback(() => {
    fetch('https://web-scraper-corona-cases.herokuapp.com/covidData')
    .then(res => res.json())
    .then(
      (result) => {
        setCovidData(result.data);
        isNetworkDataReceived.current = true;
      },
      (error) => {
        console.log('Error from API call', error);
      }
    )
  }, []);

  useEffect(() => {
    // fetch cached data
    caches.match('https://web-scraper-corona-cases.herokuapp.com/covidData').then(function(response) {
      if (!response) throw Error("No data");
      return response.json();
    }).then(function(data) {
      // don't overwrite newer network data
      if (!isNetworkDataReceived.current) {
        setCovidData(data.data);
      }
    }).catch(function() {
      // we didn't get cached data, the network is our last hope:
      getAndSetDataInState();
    });

    // Making api call in intervals to keep updating the data
    let interval = setInterval(getAndSetDataInState, 600000);
    return () => {
      // On umnount, clear the interval
      clearInterval(interval);
    }
  }, [getAndSetDataInState]);

  useEffect(() => {
    let totalActiveCases = 0;
    let totalCured = 0;
    let totalDeaths = 0;
    Object.keys(covidData).forEach((stateData) => {
      totalActiveCases += +covidData[stateData].activeCases;
      totalCured += +covidData[stateData].cured;
      totalDeaths += +covidData[stateData].deaths;
    });
    setTotalCasesData({
      totalActiveCases,
      totalCured,
      totalDeaths,
    });
  }, [covidData]);

  return (
    <Container>
      <Row  className="heading-row">
        <h1> Covid Cases Tracking PWA</h1>
      </Row>
      <Row>
        <Table striped bordered hover className="tableContainer">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>State</th>
              <th>Active Cases</th>
              <th>Cured</th>
              <th>Deaths</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(covidData).map((stateData, index) => (
                <tr key={stateData}>
                  <td>{index + 1}</td>
                  <td>{covidData[stateData].state}</td>
                  <td>{covidData[stateData].activeCases}</td>
                  <td>{covidData[stateData].cured}</td>
                  <td>{covidData[stateData].deaths}</td>
                </tr>
              ))
            }
            {
              totalcasesData ? (
                <tr>
                  <th colSpan={2}>Total#</th>
                  <th>{totalcasesData.totalActiveCases}</th>
                  <th>{totalcasesData.totalCured}</th>
                  <th>{totalcasesData.totalDeaths}</th>
                </tr>
              ) : null
            }
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}

export default App;
