import utils from '../utils/formatting.js'

function InvoiceResult({ isError, errorMessage, isSuccess, result }) {
  return (
    <div className="result">
      {isError ? (
        <div className="errorBox" role="alert">
          {errorMessage || 'Preview request failed'}
        </div>
      ) : null}

      {isSuccess && result ? (
        <div className="resultCard" aria-label="Invoice preview result">
          <div className="resultRow">
            <span className="resultKey">Student Status:</span>
            <span className="resultValue">{String(result.status)}</span>
          </div>
          <div className="resultRow">
            <span className="resultKey">Base Price:</span>
            <span className="resultValue">{utils.formatUsd(result.basePrice)}</span>
          </div>
          <div className="resultRow">
            <span className="resultKey">Final Price:</span>
            <span className="resultValue resultValueStrong">{utils.formatUsd(result.calculatedPrice)}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default InvoiceResult
