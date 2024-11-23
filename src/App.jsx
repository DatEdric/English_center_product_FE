import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClassroomComponent from './Component/Classroom/ClassroomComponent';
import ClassroomDetailComponent from './Component/Classroom/ClassroomDetailComponent';
import DeletedClassroomComponent from './Component/Classroom/DeletedClassroomComponent';
import DashboardComponent from './Component/DashboardComponent';
import ScheduleComponent from './Component/Schedule/ScheduleComponent';
import DeletedTeacherComponent from './Component/Teacher/DeletedTeacherComponent';
import TeacherComponent from './Component/Teacher/TeacherComponent';
import TeacherDetailComponent from './Component/Teacher/TeacherDetailComponent';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<DashboardComponent />}>
                    <Route path="/classroom" element={<ClassroomComponent />} />
                    <Route
                        path="/classroom/edit/:id/:date"
                        element={<ClassroomDetailComponent />}
                    />
                    <Route
                        path="/classroom/deleted-all"
                        element={<DeletedClassroomComponent />}
                    />
                    <Route
                        path="/upload-schedule"
                        element={<ScheduleComponent />}
                    />
                    {/* <Route
                        path="/schedule/edit/:id/"
                        element={<ScheduleDetailComponent />}
                    />
                    <Route
                        path="/schedule/deleted-all"
                        element={<DeletedScheduleComponent />}
                    /> */}
                    <Route path="/teacher" element={<TeacherComponent />} />
                    <Route
                        path="/teacher/edit/:id/:schedule_date"
                        element={<TeacherDetailComponent />}
                    />
                    <Route
                        path="/teacher/deleted-all"
                        element={<DeletedTeacherComponent />}
                    />
                </Route>
            </Routes>
            <ToastContainer />
        </>
    );
}

export default App;
