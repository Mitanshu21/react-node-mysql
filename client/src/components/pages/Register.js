import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../UI/InputField";
import ButtonT from "../UI/ButtonT";
import { checkError } from "../validator/InputValidators";

function Register() {
  const [userError, setUserError] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  });
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  });

  let navigate = useNavigate();

  const handleChangeUser = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
    const err = checkError(e.target.name, e.target.value, userError);
    setUserError({ ...err });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formValues);

    fetch(`${process.env.REACT_APP_ROUTE}/register`, {
      method: "post",
      body: JSON.stringify({ ...formValues }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          alert(result.error);
          setUserError({ ...userError, email: "Email already exist." });
        } else if (result.msg) {
          alert(result.msg);
          navigate("/login");
          setFormValues({
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            role: "",
          });
        } else if (result) {
          alert("Data saved successfully");
          navigate("/login");
          setFormValues({
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            role: "",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="flex justify-center pt-20">
        <div className="w-2/5 bg-gray-100 rounded shadow-md p-8 m-4">
          <form onSubmit={handleSubmit}>
            <div className="flex mb-4">
              <InputField
                parentclassname={"w-1/2 mr-2"}
                label={"First Name"}
                name={"firstname"}
                placeholder={"enter your First Name"}
                value={formValues.firstname}
                onchange={(e) => handleChangeUser(e)}
                error={userError.firstname}
              />

              <InputField
                parentclassname={"w-1/2 ml-2"}
                label={"Last Name"}
                name={"lastname"}
                placeholder={"enter your Last Name"}
                value={formValues.lastname}
                onchange={(e) => handleChangeUser(e)}
                error={userError.lastname}
              />
            </div>

            <InputField
              parentclassname={"mb-4"}
              label={"Email Address"}
              type={"email"}
              name={"email"}
              placeholder={"enter your Email Address"}
              value={formValues.email}
              onchange={(e) => handleChangeUser(e)}
              error={userError.email}
            />

            <InputField
              parentclassname={"mb-4"}
              label={"Password"}
              type={"password"}
              name={"password"}
              placeholder={"enter your password"}
              value={formValues.password}
              onchange={(e) => handleChangeUser(e)}
              error={userError.password}
            />

            <div className="mb-4">
              <label className="block text-sm">Role*</label>
              <select
                className="appearance-none border bg-white rounded w-full py-2 px-3 text-grey-darker"
                name="role"
                value={formValues.role}
                onChange={(e) => handleChangeUser(e)}
              >
                <option value="" disabled>
                  Select role
                </option>
                <option>Customer</option>
                <option>Admin</option>
              </select>
              {userError.role && (
                <p className="text-sm text-red-600/100">{userError.role}</p>
              )}
            </div>
            <ButtonT
              type="submit"
              color="bg-green-500"
              hovercolor="hover:bg-green-700"
              disabled={!(Object.keys(userError).length === 0)}
              classname={
                !(Object.keys(userError).length === 0) && "cursor-not-allowed"
              }
            >
              Submit
            </ButtonT>
            {/* </form> */}
            <p className="text-center text-sm pt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-700">
                Login here.
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
