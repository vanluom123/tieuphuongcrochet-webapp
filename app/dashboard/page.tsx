import { ROUTE_PATH } from "../lib/constant";


const Dashboard = () => {
    return (
        <div>
            Admin Dashboard
        </div>
    );
};

Dashboard.auth = {
    required: true,
    role: 'ADMIN',
    redirectTo: ROUTE_PATH.LOGIN
}

export default Dashboard;