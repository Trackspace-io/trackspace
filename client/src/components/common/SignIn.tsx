import * as React from 'react';
import style from '../../styles/common/SignIn.module.css';
import SignInSrc from '../../images/teacher.svg';
import Typography from 'components/gui/Typography';
import { Input, useInput } from 'components/gui/Input';

const SignIn: React.FC = () => {
  const { input, handleInputChange } = useInput({ email: 0, password: 0 });

  return (
    <div className={style['container']}>
      <div className={style['body']}>
        <img src={SignInSrc} className={style['img']} />
        <div className={style['fields']}>
          <Typography variant="title">Sign In</Typography>
          <form>
            <Input name="email" type="text" label="Email" value={input.email} onChange={handleInputChange} />
            <Input name="password" type="text" label="Password" value={input.password} onChange={handleInputChange} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
