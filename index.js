const { ServerResponse } = require("http");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const { exit } = require("process");
const { defaultIfEmpty } = require("rxjs");
require("console.table");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
});

const start = () => {
    inquirer
        .prompt([
            {
                type: `list`,
                message: `What would you like to do?`,
                name: `questions`,
                choices: [
                    { name: "View All Employees", value: 1 },
                    { name: "Add Employee", value: 2 },
                    { name: "Update Employee Role", value: 3 },
                    { name: "View All Roles", value: 4 },
                    { name: "Add Role", value: 5 },
                    { name: "View All Departments", value: 6 },
                    { name: "Add Department", value: 7 },
                    { name: "Quit", value: 8 },
                ],
            },
        ])
        .then((answer) => {
            switch (answer.questions) {
                case 1:
                    viewEmployees();
                    break;

                case 2:
                    addEmployee();
                    break;

                case 3:
                    updateEmployee();
                    break;

                case 4:
                    viewAllRoles();
                    break;
                case 5:
                    addRole();
                    break;
                case 6:
                    viewAllDepartments();
                    break;
                case 7:
                    addDepartment();
                    break;
                case 8:
                    console.log("Good bye!");
                    break;
            }
        });
};

const viewEmployees = () => {
    db.query(
        "SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, employee.manager_id AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id ASC;",
        (err, data) => {
            if (err) {
                throw err;
            } else {
                console.table(data);
                start();
            }
        }
    );
};

const addEmployee = () => {};

const updateEmployee = () => {};

const viewAllRoles = () => {
    db.query("SELECT * FROM role ORDER BY role.id ASC;", (err, data) => {
        if (err) {
            throw err;
        } else {
            console.table(data);
            start();
        }
    });
};

const addRole = () => {};

const viewAllDepartments = () => {
    db.query(
        "SELECT * FROM department ORDER BY department.id ASC;",
        (err, data) => {
            if (err) {
                throw err;
            } else {
                console.table(data);
                start();
            }
        }
    );
};

const addDepartment = () => {};

start();
