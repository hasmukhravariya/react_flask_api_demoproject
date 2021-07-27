import { render as rtlRender, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import Routes from "../Routes"
import { LocalStorageMock } from '@react-mock/localstorage';
import LoginPage from "../components/LoginPage";
import { CHECK_USER } from "../components/LoginForm";
import { USER_REGISTER } from "../components/RegisterForm";
import { TASKS_QUERY } from "../components/Home"
import wait from "waait";

const user={
	email: true,
	google: false,
	data: {
		id: "3",
        name: "Hasmukh Patel",
        password: "true",
        email: "hasmukh16000@gmail.com",
        username: "has",
        image: "https://lh3.googleusercontent.com/a/AATXAJytw9wkZG5Frd35_RS5K1ISrLo3VCypLj86PHK9=s96-c",
        address: "Bandra, Mumbai, Maharashtra, India",
        phone: "7021696536"
	}
}


const tasks=[
	{
		"id": "1",
		"assigned": "Hasmukh Ravariya",
		"title": "React Testing library",
		"status": "Hold",
		"description": "Look into documentation of react testing library",
		"creater": "Aman Singh"
	},
	{
		"id": "3",
		"assigned": "Hasmukh Ravariya",
		"title": "React Testing library",
		"status": "In Progress",
		"description": "Look into documentation of react testing library",
		"creater": "Aman Singh"
	},
	{
		"id": "19",
		"assigned": "Hasmukh Ravariya",
		"title": "Demo Project",
		"status": "Open",
		"description": "Create Demo project using React and flask api",
		"creater": "Aman Singh"
	}
]

const mocks = [
	{
      request: {
      	query: CHECK_USER,
        variables: { 
          checkUserInput: {
      		email:"hasmukh16000@gmail.com",
      		password:"Hasmukh@16000"
  	      },
  		},
      },
      result: {
		  data: {
		    checkUser: {
		      status: true,
		      error: null,
		      result: {
		        id: "3",
		        name: "Hasmukh Patel",
		        password: "true",
		        email: "hasmukh16000@gmail.com",
		        username: "has",
		        image: "https://lh3.googleusercontent.com/a/AATXAJytw9wkZG5Frd35_RS5K1ISrLo3VCypLj86PHK9=s96-c",
		        address: "Bandra, Mumbai, Maharashtra, India",
		        phone: "7021696536"
		      }
		    }
		  }
		},
    },
    {
      request: {
      	query: CHECK_USER,
        variables: { 
          checkUserInput: {
      		email:"hasmukh1600@gmail.com",
      		password:"Hasmukh@16000"
  	      },
  		},
      },
      result: {
		  data: {
		    checkUser: {
		      status: false,
		      error: "Invalid Username/Email",
		      result:null
		    }
		  }
		},
    },
    {
		request:{
			query:TASKS_QUERY
		},
		result:{
		  "data": {
		    "tasks": tasks
		  }
		}
	},
];

const createusermock = [
	{
		request:{
			query:USER_REGISTER,
			variables:{
				"createUserInput": {
				    "type":"email",
				    "user":{
				      "name":"Graphql Testing",
				      "email":"Hmukh00@gmail.com",
				      "username":"hasu.ravariya",
				      "password":"Hasmukh@16699"
				    }
				}
			},
		},
		result:{
		  data: {
		    createUser: {
		      status: true,
		      errors: null,
		      result: {
		        id: "3",
		        email: "Hmukh00@gmail.com",
		        name: "Graphql Testing",
		        username: "hasu.ravariya",
		        password: "true",
		        image: null,
		        address: null,
		        phone: null
		      }
		    }
		  }
		}
	},
	{
		request:{
			query:TASKS_QUERY
		},
		result:{
		  "data": {
		    "tasks": tasks
		  }
		}
	},
];


afterEach(cleanup);

describe("Login Page test", () => {

	const render = (ui,{route="/", mock=mocks, ...renderOptions} = {}) => {
	    window.history.pushState({}, 'Form page', route)
	    const Wrapper = ({ children }) => (
	      <MockedProvider mocks={mock} addTypename={false}>
	      	<LocalStorageMock items={{  }}>
	      		<Routes>
	      			{children}
				</Routes>
			</LocalStorageMock>
	      </MockedProvider>
	    );
	    return rtlRender(ui, { wrapper:Wrapper, ...renderOptions });
	};

	const renderwithlocalstorage = (ui,{route="/",...renderOptions} = {}) => {
	    window.history.pushState({}, 'Form page', route)
	    const Wrapper = ({ children }) => (
	      <MockedProvider mocks={mocks} addTypename={false}>
	      	<LocalStorageMock items={{ user: JSON.stringify(user) }}>
	      		<Routes>
	      			{children}
				</Routes>
			</LocalStorageMock>
	      </MockedProvider>
	    );
	    return rtlRender(ui, { wrapper:Wrapper, ...renderOptions });
	};


	test('renders image, login, register button', () => {
    	render(<LoginPage/>)
    	expect(screen.getByText(/Demo Project Using React and Flask Api/i)).toBeInTheDocument();
    	expect(screen.getByText(/Login/i)).toBeInTheDocument();
    	expect(screen.getByText(/Register/i)).toBeInTheDocument();
  	});


  	test('renders login Form On click', async() => {
    	render(<LoginPage/>)
    	expect(screen.getByText(/Login/i)).toBeInTheDocument();
    	userEvent.click(screen.getByText(/Login/i))
    	expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  	});

  	test('renders Register Form On click', async() => {
    	render(<LoginPage/>)
    	expect(screen.getByText(/Register/i)).toBeInTheDocument();
    	userEvent.click(screen.getByText(/Register/i))
    	expect(screen.getByText(/Username/i)).toBeInTheDocument();   	
  	});


  	test('renders LoginPage with Local storage', async() => {
    	renderwithlocalstorage(<LoginPage/>)
    	await wait(0);
    	expect(screen.getByText(/Task Table/i)).toBeInTheDocument();   	
  	});

  	test('renders Home Page on successful login', async() => {
    	render(<LoginPage/>)
    	expect(screen.getByText(/Login/i)).toBeInTheDocument();
    	userEvent.click(screen.getByText(/Login/i))
    	userEvent.type(screen.getByLabelText(/email/i), "hasmukh16000@gmail.com");
    	userEvent.type(screen.getByLabelText(/password/i), "Hasmukh@16000");
    	expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    	fireEvent.click(screen.getByText(/Sign in/i))
    	await wait(0)
  		expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
  		await wait(0)
  		expect(screen.getByText(/Task Table/i)).toBeInTheDocument(); 
  	});

  	test('renders login Page on unsuccessful login', async() => {
  		window.alert = jest.fn();
    	render(<LoginPage/>)
    	expect(screen.getByText(/Login/i)).toBeInTheDocument();
    	userEvent.click(screen.getByText(/Login/i))
    	userEvent.type(screen.getByLabelText(/email/i), "hasmukh1600@gmail.com");
    	userEvent.type(screen.getByLabelText(/password/i), "Hasmukh@16000");
    	expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    	fireEvent.click(screen.getByText(/Sign in/i))
    	await wait(0);
    	expect(window.alert).toBeCalledWith("\"Invalid Username/Email\"");
  	});


  	test('renders Home Page on successful Register', async() => {
    	render(<LoginPage/>, { mock:createusermock })
    	expect(screen.getByText(/Register/i)).toBeInTheDocument();
    	userEvent.click(screen.getByText(/Register/i))
    	expect(screen.getByText(/Username/i)).toBeInTheDocument();	
    	userEvent.type(screen.getByLabelText(/email/i), "Hmukh00@gmail.com");
    	userEvent.type(screen.getByLabelText(/password/i), "Hasmukh@16699");
    	userEvent.type(screen.getByLabelText(/username/i), "hasu.ravariya");
    	userEvent.type(screen.getByLabelText("name"), "Graphql Testing");
    	userEvent.click(screen.getByLabelText(/register/i))
    	const temp={
    		email: true,
				google: false,
				data: {
					id: "3",
			        email: "Hmukh00@gmail.com",
			        name: "Graphql Testing",
			        username: "hasu.ravariya",
			        password: "true",
			        image: null,
			        address: null,
			        phone: null
				}
    	}
    	await wait(0);
  		expect(localStorage.getItem('user')).toBe(JSON.stringify(temp));
  		await wait(0);
  		expect(screen.getByText(/Task Table/i)).toBeInTheDocument(); 
  	});

  	test('renders login form on click already registered', async() => {
  		window.alert = jest.fn();
    	render(<LoginPage/>)
    	expect(screen.getByText(/Register/i)).toBeInTheDocument();
    	userEvent.click(screen.getByText(/Register/i))
    	expect(screen.getByText(/Register User/i)).toBeInTheDocument();
    	userEvent.click(screen.getByLabelText(/login/i))
    	expect(screen.getByText(/Sign In/i)).toBeInTheDocument();    	
  	});


});
