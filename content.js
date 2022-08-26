window.onload = function () {
  const companyNameContainer = document.querySelector(".companyName");
  if (companyNameContainer && companyNameContainer.innerText) {
    chrome.runtime.sendMessage({
      type: "LANYAP_QBO_COMPANY_CHANGED",
      payload: {
        companyName: companyNameContainer.innerText,
      },
    });
  }


  // Adding reconcile link
  //
  if (window.location.href.includes('app/reconcileAccount')) {

    window.setTimeout(() => {

      const dates = Array.from(document.querySelectorAll('.dgrid-content .dgrid-row-table .dgrid-column-0 div div')).map(item => new Date(item.innerText)).sort((a, b) => a.getTime() - b.getTime()).map(date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);

      const search = window.location.search.substring(1)
      const params = JSON.parse(
        '{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}'
      )

      const url = `http://localhost:3001/reconcilation?applicationId=2&accountId=${params.accountId}&from=${dates[0]}&to=${dates[dates.length - 1]}&startingBalance=${parseFloat(document.querySelector('.automationID-BeginningBalance .ha-numeral').innerText.replace('$', '').replace(',', ''))}&endingBalance=${parseFloat(document.querySelector('.automationID-StatementEndingBalance .medium').innerText.replace('$', '').replace(',', ''))}`

      const br = document.createElement('BR')
      const link = document.createElement('A')
      link.target = '_blank'
      link.href = url;
      link.innerText = 'Reconcile using Lanyap'
      document.querySelector('.automationID-Difference').appendChild(br)
      document.querySelector('.automationID-Difference').appendChild(link)
    }, 2000)

  }


}
