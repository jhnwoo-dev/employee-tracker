SELECT
    employee.id AS id,
    employee.first_name AS first_name,
    employee.last_name AS last_name,
    role.title AS title,
    department.name AS department,
    role.salary AS salary,
    employee.manager_id AS manager
FROM department
    JOIN role ON role.department_id = department.id
    JOIN employee ON employee.role_id = role.id
ORDER BY employee.id ASC;