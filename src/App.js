import React from 'react';
import './App.css';

function Course(props) {
  const course = props.course
  return (
    <tr>
      <td><a href={course.course_link} target="_blank" rel="noopener noreferrer">{course.course_code}</a></td>
      <td>{course.course_name}</td>
      <td>{course.implementation_year}</td>
      <td>{course.period.join(", ")}</td>
    </tr>
  )
}

function App() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [courses, setCourses] = React.useState([])
  const [periods, setPeriods] = React.useState([])

  React.useEffect(() => {
    fetch('/courses.json')
      .then(data => data.json())
      .then(data => setCourses(data))
  }, [])

  console.log('searchTerm = ', searchTerm)
  console.log('periods = ', periods)

  const filteredCourses = courses
    .filter(course =>
      (course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      course.period.filter(value => periods.includes(value)).length > 0
    )

  return (
    <div className="App">
        <input type="text" onChange={event => setSearchTerm(event.target.value)} />
        <input type="checkbox" onClick={event => {
          if (event.target.checked) {
            setPeriods([...periods, '1'])
          } else {
            setPeriods([...periods].filter(x => x !== '1'))
          }
        }} />  1
        <input type="checkbox" onClick={event => {
          if (event.target.checked) {
            setPeriods([...periods, '2'])
          } else {
            setPeriods([...periods].filter(x => x !== '2'))
          }
        }} />  2
        <input type="checkbox" onClick={event => {
          if (event.target.checked) {
            setPeriods([...periods, '3'])
          } else {
            setPeriods([...periods].filter(x => x !== '3'))
          }
        }} />  3
        <input type="checkbox" onClick={event => {
          if (event.target.checked) {
            setPeriods([...periods, '4'])
          } else {
            setPeriods([...periods].filter(x => x !== '4'))
          }
        }} />  4
        <table className="courses">
          <tr>
            <th>Course code</th>
            <th>Course name</th>
            <th>Implementation year</th>
            <th>Periods</th>
          </tr>
          {filteredCourses.map(course => (
            <Course course={course} />
          ))}
        </table>
    </div>
  );
}

export default App;
