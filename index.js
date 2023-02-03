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

const addEmployee = () => {
    let roleList = [];
    db.query("SELECT title FROM role", (err, data) => {
        if (err) {
            throw err;
        } else {
            for (let i = 0; i < data.length; i++) {
                roleList.push(data[i].title);
            }
            // console.log(roleList);
        }
    });

    let managerList = [];
    managerList.push("null");
    db.query(
        "SELECT first_name FROM employee JOIN role ON employee.role_id = role.id WHERE role.title IN('Sales Lead','Lead Engineer','Account Manager', 'Legal Team Lead')",
        (err, data) => {
            if (err) {
                throw err;
            } else {
                for (let i = 0; i < data.length; i++) {
                    managerList.push(data[i].first_name);
                }
                // console.log(managerList);
            }
        }
    );
    inquirer
        .prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?",
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?",
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roleList,
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: managerList,
            },
        ])
        .then((ans2) => {
            if (ans2.role == "Sales Lead") {
                ans2.role = 1;
            } else if (ans2.role == "Salesperson") {
                ans2.role = 2;
            } else if (ans2.role == "Lead Engineer") {
                ans2.role = 3;
            } else if (ans2.role == "Software Engineer") {
                ans2.role = 4;
            } else if (ans2.role == "Account Manager") {
                ans2.role = 5;
            } else if (ans2.role == "Accountant") {
                ans2.role = 6;
            } else if (ans2.role == "Legal Team Lead") {
                ans2.role = 7;
            } else if (ans2.role == "Lawyer") {
                ans2.role = 8;
            }
            if (ans2.manager == "Null") {
                ans2.manager = null;
            } else if (ans2.manager == "John") {
                ans2.manager = 1;
            } else if (ans2.manager == "Ashley") {
                ans2.manager = 2;
            } else if (ans2.manager == "Kunal") {
                ans2.manager = 3;
            } else if (ans2.manager == "Sarah") {
                ans2.manager = 4;
            }

            db.query(
                "INSERT INTO employee SET first_name=?, last_name=?, role_id=?,manager_id=?",
                [ans2.firstName, ans2.lastName, ans2.role, ans2.manager],
                (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log(
                            "Your employee has been successfully added!"
                        );
                        start();
                    }
                }
            );
        });
};

const updateEmployee = () => {
    let roleList = [];
    db.query("SELECT title FROM role", (err, data) => {
        if (err) {
            throw err;
        } else {
            for (let i = 0; i < data.length; i++) {
                roleList.push(data[i].title);
            }
            // console.log(roleList);
        }
    });

    let employeeList = [];
    db.query("SELECT first_name FROM employee)", (err, data) => {
        if (err) {
            throw err;
        } else {
            for (let i = 0; i < data.length; i++) {
                employeeList.push(data[i].first_name);
            }
            // console.log(employeeList);
        }
    });
    inquirer
        .prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee do you want to update?",
                choices: employeeList,
            },
            {
                type: "list",
                name: "role",
                message:
                    "Which role do you want to assign the selected employee?",
                choices: roleList,
            },
        ])
        .then((ans2) => {
            db.query(
                "UPDATE employee SET role_id=(SELECT id FROM role WHERE title=?)WHERE first_name=?",
                [ans2.role, ans2.employee],
                (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log(
                            "Your employee's role has been successfully updated!"
                        );
                        start();
                    }
                }
            );
        });
};

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

const addRole = () => {
    let departmentList = [];
    db.query("SELECT name FROM department", (err, data) => {
        if (err) {
            throw err;
        } else {
            for (let i = 0; i < data.length; i++) {
                departmentList.push(data[i].name);
            }
            // console.log(departmentList);
        }
    });
    inquirer
        .prompt([
            {
                type: "input",
                name: "role",
                message: "What is the name of the role?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?",
            },
            {
                type: "list",
                name: "department",
                message: "Which department does the role belong to?",
                choices: departmentList,
            },
        ])
        .then((ans3) => {
            db.query(
                "INSERT INTO role SET title=?, salary=?, department_id=(SELECT id FROM department WHERE name =?)",
                [ans3.role, ans3.salary, ans3.department],
                (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log("Your role has been successfully added!");
                        start();
                    }
                }
            );
        });
};

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

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the department?",
            },
        ])
        .then((ans3) => {
            db.query(
                "INSERT INTO department SET name=?",
                [ans3.name],
                (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log(
                            "Your department has been successfully added!"
                        );
                        start();
                    }
                }
            );
        });
};

start();

// function testarea() {
//     let managerList = [];
//     managerList.push("null");
//     db.query(
//         "SELECT first_name FROM employee JOIN role ON employee.role_id = role.id WHERE role.title IN('Sales Lead','Lead Engineer','Account Manager', 'Legal Team Lead')",
//         (err, data) => {
//             if (err) {
//                 throw err;
//             } else {
//                 for (let i = 0; i < data.length; i++) {
//                     managerList.push(data[i].first_name);
//                 }
//                 console.log(managerList);
//             }
//         }
//     );
// }
// testarea();
