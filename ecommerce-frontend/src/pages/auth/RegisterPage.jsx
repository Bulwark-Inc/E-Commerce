import AuthWrapper from '../../components/layout/AuthLayout';
import RegisterForm from '../../components/forms/RegisterForm';

const RegisterPage = () => {
  return (
    <AuthWrapper title="Create an Account">
      <RegisterForm />
    </AuthWrapper>
  );
};

export default RegisterPage;
