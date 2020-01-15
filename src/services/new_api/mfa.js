const verifyOTPCode = ({ clientId, clientSecret, instance, mfaToken, code }) => {
  const url = `${instance}/oauth/mfa/challenge`
  const form = new window.FormData()

  form.append('client_id', clientId)
  form.append('client_secret', clientSecret)
  form.append('mfa_token', mfaToken)
  form.append('code', code)
  form.append('challenge_type', 'totp')

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const verifyRecoveryCode = ({ clientId, clientSecret, instance, mfaToken, code }) => {
  const url = `${instance}/oauth/mfa/challenge`
  const form = new window.FormData()

  form.append('client_id', clientId)
  form.append('client_secret', clientSecret)
  form.append('mfa_token', mfaToken)
  form.append('code', code)
  form.append('challenge_type', 'recovery')

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const mfa = {
  verifyOTPCode,
  verifyRecoveryCode
}

export default mfa
