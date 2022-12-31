export const checkError = (name, value, error) => {
  const err = { ...error };

  if (name === "firstname")
    if (value.length < 3)
      err.firstname = "firstname should atleast 3 character long!";
    else delete err.firstname;

  if (name === "lastname")
    if (value.length < 3)
      err.lastname = "lastname should atleast 3 character long!";
    else delete err.lastname;

  if (name === "email")
    if (
      value.length === 0 ||
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
    )
      err.email = "email is Invalid";
    else delete err.email;

  if (name === "password")
    if (value.length < 8 || value.length > 16)
      err.password = "password should between 8 to 16 character long.";
    else {
      delete err.password;
    }

  if (name === "role") if (value) delete err.role;
  return err;
};
