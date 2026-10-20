import { Routes, Route } from 'react-router-dom'
import { PublicLayout } from './routes/PublicLayout.jsx'
import { HomePage } from './routes/HomePage.jsx'
import { UiTestPage } from './routes/UiTestPage.jsx'
import { ReaderShell } from './components/layout/ReaderShell.jsx'
import { ReaderOverviewPage } from './routes/reader/ReaderOverviewPage.jsx'
import { ReaderLibraryPage } from './routes/reader/ReaderLibraryPage.jsx'
import { SellerShell } from './components/layout/SellerShell.jsx'
import { SellerDashboardPage } from './routes/seller/SellerDashboardPage.jsx'
import { SellerListingsPage } from './routes/seller/SellerListingsPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route path="/me" element={<ReaderShell />}>
        <Route index element={<ReaderOverviewPage />} />
        <Route path="library" element={<ReaderLibraryPage />} />
      </Route>

      <Route path="/seller" element={<SellerShell />}>
        <Route index element={<SellerDashboardPage />} />
        <Route path="listings" element={<SellerListingsPage />} />
      </Route>

      <Route path="/dev/ui-test" element={<UiTestPage />} />
    </Routes>
  )
}

export default App