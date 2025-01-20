import "../assets/css/notfoundpage.css"
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className='space-background'>
      <div className='asteroids'></div>
      <div className='asteroids'></div>
      <div className='asteroids'></div>
      <div className='asteroids'></div>
      <div className="errorbox">
        <h1 className='four'>4</h1>
        <div className="moon">
          <div className="dots"></div>
          <div className="dots"></div>
          <div className="dots"></div>
        </div>
        <h1 className='four'>4</h1>
      </div>
      <h1 className='oops'>Perdido en el espacio</h1>
      <p className='edge'>has llegado al borde del universo</p>
      if(user=)
      <Link to={"/"} className='goback'>Regresar</Link>
    </div>
  )
}

export default NotFoundPage