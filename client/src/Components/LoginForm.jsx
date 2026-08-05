function LoginForm({ onLogin }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin(e.target.email.value, e.target.password.value);
      }}
    >
      <label htmlFor="email">Email:</label>
      <input id="email" type="email" name="email" placeholder="Email" />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        name="password"
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;