import React from 'react'
import IssueReportInputForm from '../components/reports/issueReportInputForm'
import IssueReport from '../components/reports/issueReport'
import GiveAway from '../components/reports/giveAways'
import GiveAwayInputForm from '../components/reports/giveAwayInputForm.jsx'
import OfferHelp from '../components/reports/offerHelp.jsx'
import OfferHelpInputForm from '../components/reports/offerHelpInputForm.jsx'
import HelpRequest from '../components/reports/helpRequest.jsx'
import HelpReportInputForm from '../components/reports/helpRequestInputForm.jsx'
import AddressInputForm from '../components/AddressInputForm.jsx'


export default function HomePage() {

  return (
    <div>
      HomePage
      {/* <AddressInputForm/> */}
      {/* <HelpReportInputForm/> */}
      {/* <HelpRequest reportId="2"/> */}
      {/* <OfferHelpInputForm/> */}
      <OfferHelp reportId='4'/>
      {/* <GiveAwayInputForm/> */}
      {/* <GiveAway reportId='13'/> */}

      {/* <IssueReport reportId='6'/> */}
       {/* <IssueReportInputForm/> */}
    </div>
  )
}
