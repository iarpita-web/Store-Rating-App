import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../utils/api.js';
import { useAuth } from '../state/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['USER', 'OWNER']).default('USER'),
});

export default function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { role: 'USER' } });
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const res = await api.post('/auth/signup', values);
      login(res.data.user, res.data.token);
      navigate('/stores');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="card">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <label>
          Name
          <input type="text" {...register('name')} />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </label>
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
        <label>
          Role
          <select {...register('role')}>
            <option value="USER">User</option>
            <option value="OWNER">Store Owner</option>
          </select>
        </label>
        <button type="submit" disabled={isSubmitting} className="primary">{isSubmitting ? 'Creating...' : 'Create Account'}</button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
