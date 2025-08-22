import { Toaster } from "react-hot-toast"
import { router } from './Routes'
import { RouterProvider } from "react-router-dom";
const App = () => {


  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <RouterProvider className='App' router={router} />
    </>
  )
}

export default App