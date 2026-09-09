import { useState } from 'react'
import { assetUrl } from '../asset'

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('Justin')

  return (
    <div className="login-screen">
      <div className="window login-dialog">
        <div className="title-bar">
          <div className="title-bar-text">Login</div>
        </div>
        <div className="window-body">
          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault()
              onLogin()
            }}
          >
            <img
              className="login-key"
              src={assetUrl('/assets/key_win_alt-2.png')}
              alt=""
              width={48}
              height={48}
            />
            <div className="login-main">
              <p className="login-message">
                Welcome to my portfolio!
              </p>
              <p className="login-reminder">
                No need for a username/password, just press login!
              </p>
              <div className="login-field">
                <label htmlFor="login-user">User name:</label>
                <input
                  id="login-user"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="login-field">
                <label htmlFor="login-pass">Password:</label>
                <input id="login-pass" type="password" />
              </div>
            </div>
            <div className="login-actions">
              <button type="submit">Login</button>
              <button type="button" onClick={onLogin}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
