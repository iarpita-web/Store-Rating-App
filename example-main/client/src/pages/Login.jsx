import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../utils/api.js';
import { useAuth } from '../state/AuthContext.jsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/stores';

  const onSubmit = async (values) => {
    try {
      const res = await api.post('/auth/login', values);
      login(res.data.user, res.data.token);
      navigate(from);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label>
          Email
          <input type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </label>
        <label>
          Password
          <input type="password" {...register('password')} />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </label>
        <button type="submit" disabled={isSubmitting} className="primary">{isSubmitting ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="muted">No account? <Link to="/signup">Create one</Link></p>
    </div>
  );
}
