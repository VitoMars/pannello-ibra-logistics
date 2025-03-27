import './App.css'
// Mantine
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
// Dayjs
import 'dayjs/locale/it';
// PrimeReact
import 'primereact/resources/themes/lara-light-blue/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
// import 'primeflex/primeflex.css'; // flex

import Home from "./components/Home";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";

function App() {
  return (
    <MantineProvider>
      <DatesProvider settings={{ locale: "it" }}>
        <Home />
      </DatesProvider>
    </MantineProvider>
  )
}

export default App
