import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import PlayersPage from './components/PlayersPage.jsx';
import './DashboardPage.css';

function DashboardPage() {
  return (
    <div>
      <div className='dashboard-card-row'>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>Appointments</div>
          <table className='db-appointment-table'>
            <thead>
              <th>Sl No</th>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
            </thead>
            <tbody>
              <tr key={1}>
                <td>1</td>
                <td>Steve</td>
                <td>27-Jun</td>
                <td>10 AM</td>
              </tr>
              <tr key={2}>
                <td>2</td>
                <td>Tony</td>
                <td>27-Jun</td>
                <td>10 AM</td>
              </tr>
              <tr key={3}>
                <td>3</td>
                <td>Natasha</td>
                <td>27-Jun</td>
                <td>10 AM</td>
              </tr>
              <tr key={4}>
                <td>4</td>
                <td>Bruce</td>
                <td>27-Jun</td>
                <td>10 AM</td>
              </tr>
              <tr key={5}>
                <td>5</td>
                <td>Clint</td>
                <td>27-Jun</td>
                <td>10 AM</td>
              </tr>
            </tbody>
          </table>
          
        </div>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>Patients</div>
          <div></div>
        </div>
      </div>
      <div className='dashboard-card-row'>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>Assessments</div>
          <div></div>
        </div>
        <div className='dashboard-card'>
          <div className='dashboard-card-header'>Treatments</div>
          <div></div>
        </div>
      </div>
      
      
      
    </div>
  );
}

export default DashboardPage;

