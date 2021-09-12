import { useCallback, useEffect, useState } from 'react';
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
function App() {
  const [covidData, setCovidData] = useState<ICovidData>({});

  const getAndSetDataInState = useCallback(() => {
    fetch('http://localhost:4000/covidData')
    .then(res => res.json())
    .then(
      (result) => {
        setCovidData(result.data);
      },
      (error) => {
        console.log('Error from API call', error);
      }
    )
  }, []);

  useEffect(() => {
    // Initial API call to get the data
    getAndSetDataInState();
    // Making api call in intervals to keep updating the data
    let interval = setInterval(getAndSetDataInState, 600000);
    return () => {
      // On umnount, clear the interval
      clearInterval(interval);
    }
  }, [getAndSetDataInState]);

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
                <tr>
                  <td>{index}</td>
                  <td>{covidData[stateData].state}</td>
                  <td>{covidData[stateData].activeCases}</td>
                  <td>{covidData[stateData].cured}</td>
                  <td>{covidData[stateData].deaths}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}

export default App;
