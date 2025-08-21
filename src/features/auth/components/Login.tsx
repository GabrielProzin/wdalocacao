import { FaUser, FaLock } from 'react-icons/fa';

export const Login = () => {
  return (
    <div className="container">
      <form>
        <h1>Acesse o sistema</h1>
        <div>
          <input type="email" />
          <FaUser className="icon" />
        </div>
        <div>
          <input type="password" />
          <FaLock className="icon" />
        </div>
        <button>Entrar</button>
      </form>
    </div>
  );
};
