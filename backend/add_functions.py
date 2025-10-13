from db_connection import get_connection
from flask import Flask,request,jsonify
from flask_restful import Api
from flask_cors import CORS

app=Flask(__name__)
api=Api(app)
CORS(app) 


@app.route('/employeeinformation', methods=['GET'])
def get_employee_information():
    try:
        con = get_connection()
        cursor = con.cursor(dictionary=True)

        query = """
            SELECT 
                id,
                employee_no,
                firstname,
                middlename,
                lastname,
                department_id,
                position_id,
                salary,
                joining_date,
                pan_no,
                aadhar_no,
                mobile_no,
                email,
                pf_account_no,
                esi_no,
                fathers_name,
                resident_ph_no,
                spouse_name,
                spouse_ph_no
            FROM EmployeeInformation
        """
        cursor.execute(query)
        results = cursor.fetchall()

        response = {"employees": results}

    except Exception as e:
        response = {"error": str(e)}

    finally:
        cursor.close()
        con.close()

    return jsonify(response)





@app.route('/employeeinformation', methods=['POST'])
def add_employee_information():
    con = None
    cursor = None
    try:
        data = request.get_json()

        employee_no = data['employee_no']
        firstname = data['firstname']
        middlename = data.get('middlename')
        lastname = data['lastname']
        department_id = data['department_id']
        position_id = data['position_id']
        salary = data['salary']
        joining_date = data.get('joining_date')
        pan_no = data.get('pan_no')
        aadhar_no = data.get('aadhar_no')
        mobile_no = data.get('mobile_no')
        email = data.get('email')
        pf_account_no = data.get('pf_account_no')
        esi_no = data.get('esi_no')
        fathers_name = data.get('fathers_name')
        resident_ph_no = data.get('resident_ph_no')
        spouse_name = data.get('spouse_name')
        spouse_ph_no = data.get('spouse_ph_no')

        con = get_connection()
        cursor = con.cursor()
        query = """
        INSERT INTO EmployeeInformation 
            (employee_no, firstname, middlename, lastname, department_id, position_id, salary,
             joining_date, pan_no, aadhar_no, mobile_no, email, pf_account_no, esi_no,
             fathers_name, resident_ph_no, spouse_name, spouse_ph_no)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (employee_no, firstname, middlename, lastname, department_id, position_id, salary,
                  joining_date, pan_no, aadhar_no, mobile_no, email, pf_account_no, esi_no,
                  fathers_name, resident_ph_no, spouse_name, spouse_ph_no)

        cursor.execute(query, values)
        con.commit()
        emp_id = cursor.lastrowid

        response = {"message": f"Employee {firstname} {lastname} added successfully with id {emp_id}"}

    except Exception as e:
        response = {"error": str(e)}
    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()
    return jsonify(response)






@app.route('/attendance_status', methods=['GET'])
def get_attendance_status():
    try:
        con = get_connection()
        cursor = con.cursor(dictionary=True)
        date_filter = request.args.get('date')

        if not date_filter:
            return jsonify({"error": "Date parameter is required, e.g. ?date=2025-10-07"}), 400

        query = """
        SELECT 
            e.id AS employee_id,
            e.employee_no,
            CONCAT(e.firstname, ' ', e.lastname) AS employee_name,
            e.department_id,
            a.log_type,
            a.datetime_log
        FROM EmployeeInformation e
        LEFT JOIN AttendanceRecords a 
            ON e.id = a.employee_id AND DATE(a.datetime_log) = %s
        ORDER BY e.id;
        """
        cursor.execute(query, (date_filter,))
        results = cursor.fetchall()

        
        for row in results:
            if row["log_type"] is None:
                row["status"] = "Absent"
            elif row["log_type"].upper() == "IN":
                row["status"] = "Present"
            else:
                row["status"] = "Present"

        return jsonify({"attendance_status": results})

    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        con.close()


@app.route('/AttendanceRecords', methods=['POST'])
def add_attendence_record():
    try:
        data = request.get_json()
        employee_id = data['employee_id']
        log_type = data['log_type']  
        datetime_log = data['datetime_log']  
        date_update = data['date_update']    

        con = get_connection()
        cursor = con.cursor()

        query = """
            INSERT INTO AttendanceRecords (employee_id, log_type, datetime_log, date_update)
            VALUES (%s, %s, %s, %s)
        """
        values = (employee_id, log_type, datetime_log, date_update)
        cursor.execute(query, values)
        con.commit()
        attendance_id = cursor.lastrowid
        response = {"message": f"Attendance record added successfully with id {attendance_id}"}
    except Exception as e:
            response = {"error": str(e)}
    finally:
            cursor.close()
            con.close()
            return jsonify(response)
    


@app.route('/attendance_summary', methods=['GET'])
def attendance_summary():
    try:
        con = get_connection()
        cursor = con.cursor(dictionary=True)
        month_filter = request.args.get('month')  

        if not month_filter:
            return jsonify({"error": "Please provide a month (YYYY-MM)."}), 400

        query = """
            SELECT 
                e.id AS employee_id,
                e.employee_no,
                CONCAT(e.firstname, ' ', e.lastname) AS employee_name,
                COUNT(DISTINCT DATE(a.datetime_log)) AS present_days
            FROM EmployeeInformation e
            LEFT JOIN AttendanceRecords a
                ON e.id = a.employee_id
                AND a.log_type = 'IN'
                AND a.datetime_log >= CONCAT(%s, '-01')
                AND a.datetime_log < DATE_ADD(CONCAT(%s, '-01'), INTERVAL 1 MONTH)
            GROUP BY e.id, e.employee_no, e.firstname, e.lastname
            ORDER BY e.id;
        """

        cursor.execute(query, (month_filter, month_filter))
        results = cursor.fetchall()

        import calendar
        year, month = map(int, month_filter.split('-'))
        total_days = calendar.monthrange(year, month)[1]

        for row in results:
            present = row.get("present_days", 0)
            row["absent_days"] = total_days - present
            row["attendance_percent"] = round((present / total_days) * 100, 2)

        return jsonify({
            "month": month_filter,
            "summary": results
        })

    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        con.close()
    

    


@app.route('/GrossPay', methods=['POST'])
def add_grosspay():
    try:
        data = request.get_json()
        employee_id = data['employee_id']
        gross_salary = data['gross_salary']
        total_pay = data['total_pay']

        con = get_connection()
        cursor = con.cursor()

        cursor.execute("SELECT id FROM EmployeeInformation WHERE id = %s", (employee_id,))
        emp = cursor.fetchone()
        if emp is None:
            response = {"error": f"Employee with id {employee_id} does not exist"}
            return jsonify(response), 400

        query = """
            INSERT INTO GrossPay (employee_id, gross_salary, total_pay)
            VALUES (%s, %s, %s)
        """
        values = (employee_id, gross_salary, total_pay)

        cursor.execute(query, values)
        con.commit()
        grosspay_id = cursor.lastrowid

        response = {
            "message": f"GrossPay record added successfully with id {grosspay_id}",
            "id": grosspay_id,
            "employee_id": employee_id,
            "gross_salary": float(gross_salary),
            "total_pay": float(total_pay)
        }

    except Exception as e:
        response = {"error": str(e)}

    finally:
        cursor.close()
        con.close()
        return jsonify(response)



@app.route('/GrossPay', methods=['GET'])
def get_grosspay():
    try:
        con = get_connection()
        cursor = con.cursor()

        query = """
            SELECT g.id, g.employee_id, e.employee_no, e.firstname, e.lastname,
                   g.gross_salary, g.total_pay
            FROM GrossPay g
            JOIN EmployeeInformation e ON g.employee_id = e.id
            ORDER BY g.id DESC
        """
        cursor.execute(query)
        results = cursor.fetchall()

        grosspay_list = []
        for row in results:
            grosspay_list.append({
                "id": row[0],
                "employee_id": row[1],
                "employee_no": row[2],
                "firstname": row[3],
                "lastname": row[4],
                "gross_salary": float(row[5]),
                "total_pay": float(row[6])
            })

        response = {"grosspay_records": grosspay_list}

    except Exception as e:
        response = {"error": str(e)}

    finally:
        cursor.close()
        con.close()
        return jsonify(response)
    


@app.route('/Deduction', methods=['POST'])
def add_deduction():
    try:
        data = request.get_json()
        salary_advance = data.get('salary_advance', 0.00)
        pension = data.get('pension', 0.00)
        tax = data.get('tax', 0.00)
        national_fund = data.get('national_fund', 0.00)
        provident_fund = data.get('provident_fund', 0.00)
        total_deduction = float(salary_advance) + float(pension) + float(tax) + float(national_fund) + float(provident_fund)
        bank_id = data['bank_id']  

        con = get_connection()
        cursor = con.cursor()

        query = """
            INSERT INTO Deduction 
            (salary_advance, pension, tax, national_fund, provident_fund, total_deduction, bank_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (salary_advance, pension, tax, national_fund, provident_fund, total_deduction, bank_id)
        cursor.execute(query, values)
        con.commit()
        deduction_id = cursor.lastrowid

        response = {
            "message": f"Deduction record added successfully with id {deduction_id}",
            "deduction_id": deduction_id
        }

    except Exception as e:
        response = {"error": str(e)}

    finally:
        cursor.close()
        con.close()
        return jsonify(response)
    
    
    


@app.route('/Deduction', methods=['GET'])
def get_deductions():
   
    try:
        con = get_connection()
        cursor = con.cursor()

        query = """
            SELECT d.deduction_id, d.salary_advance, d.pension, d.tax, d.national_fund, d.provident_fund,
           d.total_deduction, b.id, b.AccountNo, b.AccountName, b.phonenumber
    FROM Deduction d
    JOIN BankDetails b ON d.bank_id = b.id
    ORDER BY d.deduction_id DESC
        """
        cursor.execute(query)
        results = cursor.fetchall()

        deductions = []
        for row in results:
            deductions.append({
                "deduction_id": row[0],
                "salary_advance": float(row[1]) if row[1] else 0.00,
                "pension": float(row[2]) if row[2] else 0.00,
                "tax": float(row[3]) if row[3] else 0.00,
                "national_fund": float(row[4]) if row[4] else 0.00,
                "total_deduction": float(row[5]) if row[5] else 0.00,
                "bank_id": row[6],
                "AccountNo": row[7],
                "AccountName": row[8],
                "phonenumber": row[9]
            })

        response = {"deduction_records": deductions}

    except Exception as e:
        response = {"error": str(e)}

    finally:
       
         cursor.close()
      
         con.close()
         return jsonify(response)


    

@app.route('/EmployeeInformation/<int:emp_id>', methods=['PUT'])
def update_employee(emp_id):
    try:
        data = request.get_json()

        employee_no = data.get('employee_no')
        firstname = data.get('firstname')
        middlename = data.get('middlename')
        lastname = data.get('lastname')
        department_id = data.get('department_id')
        position_id = data.get('position_id')
        salary = data.get('salary')

        con = get_connection()
        cursor = con.cursor()

       
        cursor.execute("SELECT id FROM EmployeeInformation WHERE id = %s", (emp_id,))
        if cursor.fetchone() is None:
            return jsonify({"error": f"Employee with id {emp_id} does not exist"}), 404

      
        query = """
            UPDATE EmployeeInformation
            SET employee_no = %s, firstname = %s, middlename = %s, lastname = %s,
                department_id = %s, position_id = %s, salary = %s
            WHERE id = %s
        """
        values = (employee_no, firstname, middlename, lastname,
                  department_id, position_id, salary, emp_id)

        cursor.execute(query, values)
        con.commit()

        response = {
            "message": f"Employee with id {emp_id} updated successfully",
            "employee_id": emp_id,
            "employee_no": employee_no,
            "firstname": firstname,
            "middlename": middlename,
            "lastname": lastname,
            "department_id": department_id,
            "position_id": position_id,
            "salary": float(salary)
        }

    except Exception as e:
        response = {"error": str(e)}

    finally:
        cursor.close()
        con.close()
        return jsonify(response)
    


@app.route('/EmployeeInformation/<int:emp_id>', methods=['DELETE'])
def delete_employee(emp_id):
    try:
        con = get_connection()
        cursor = con.cursor()

     
        cursor.execute("SELECT id FROM EmployeeInformation WHERE id = %s", (emp_id,))
        employee = cursor.fetchone()
        if employee is None:
            return jsonify({"error": f"Employee with id {emp_id} does not exist"}), 404

      
        cursor.execute("DELETE FROM allowance WHERE employee_id = %s", (emp_id,))
        cursor.execute("DELETE FROM attendancerecords WHERE employee_id = %s", (emp_id,))
        cursor.execute("DELETE FROM bankdetails WHERE emp_id = %s", (emp_id,))
        cursor.execute("DELETE FROM grosspay WHERE employee_id = %s", (emp_id,))
        cursor.execute("DELETE FROM payroll WHERE employee_id = %s", (emp_id,))
        cursor.execute("DELETE FROM salary WHERE employee_id = %s", (emp_id,))
        
        cursor.execute("DELETE FROM EmployeeInformation WHERE id = %s", (emp_id,))
        con.commit()

        response = {
            "message": f"Employee with id {emp_id} deleted successfully",
            "employee_id": emp_id
        }

    except Exception as e:
        response = {"error": str(e)}

    finally:
        cursor.close()
        con.close()
        return jsonify(response)
    


     

@app.route('/add_allowance', methods=['POST'])
def add_allowance():
    try:
        data = request.get_json()
        employee_id = data['employee_id']
        type_ = data['type']
        amount = data['amount']
        effective_date = data['effective_date']

        con = get_connection()
        cursor = con.cursor()
        query = """
            INSERT INTO Allowance (employee_id, type, amount, effective_date)
            VALUES (%s, %s, %s, %s)
        """
        values = (employee_id, type_, amount, effective_date)
        cursor.execute(query, values)
        con.commit()

        response = {
            "message": f"Allowance record added successfully for employee ID {employee_id}",
            "allowance_id": cursor.lastrowid
        }
    except Exception as e:
        response = {"error": str(e)}
    finally:
        cursor.close()
        con.close()
        return jsonify(response)
    


    
    
@app.route('/allowances', methods=['GET'])
def get_allowances():
    try:
        con = get_connection()
        cursor = con.cursor()
        query = """
            SELECT a.id, a.employee_id, e.employee_no, e.firstname, e.lastname,
                   a.type, a.amount, a.effective_date, a.date_created
            FROM Allowance a
            JOIN EmployeeInformation e ON a.employee_id = e.id
            ORDER BY a.date_created DESC
        """
        cursor.execute(query)
        results = cursor.fetchall()

        allowances = []
        for row in results:
            allowances.append({
                "allowance_id": row[0],
                "employee_id": row[1],
                "employee_no": row[2],
                "firstname": row[3],
                "lastname": row[4],
                "type": row[5],
                "amount": float(row[6]),
                "effective_date": str(row[7]),
                "date_created": str(row[8])
            })

        response = {"allowances": allowances}
    except Exception as e:
        response = {"error": str(e)}
    finally:
        cursor.close()
        con.close()
        return jsonify(response)
    



@app.route('/bonus', methods=['GET'])
def get_bonuses():
    try:
        con = get_connection()
        cursor = con.cursor(dictionary=True)
        query = """
            SELECT b.id, e.employee_no, e.firstname, e.lastname, 
                   b.bonus_type, b.amount, b.bonus_date, b.description
            FROM Bonus b
            JOIN EmployeeInformation e ON b.employee_id = e.id
            ORDER BY b.bonus_date DESC
        """
        cursor.execute(query)
        data = cursor.fetchall()
        return jsonify({"bonuses": data})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        con.close()


@app.route('/bonus', methods=['POST'])
def add_bonus():
    try:
        data = request.get_json()
        employee_id = data['employee_id']
        bonus_type = data['bonus_type']
        amount = data['amount']
        description = data.get('description', None)
        bonus_date = data.get('bonus_date', None)

        con = get_connection()
        cursor = con.cursor()
        query = """
            INSERT INTO Bonus (employee_id, bonus_type, amount, bonus_date, description)
            VALUES (%s, %s, %s, COALESCE(%s, CURDATE()), %s)
        """
        cursor.execute(query, (employee_id, bonus_type, amount, bonus_date, description))
        con.commit()
        return jsonify({"message": "Bonus added successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        con.close()


@app.route('/bonus/<int:bonus_id>', methods=['PUT'])
def update_bonus(bonus_id):
    try:
        data = request.get_json()
        bonus_type = data['bonus_type']
        amount = data['amount']
        description = data.get('description')
        bonus_date = data.get('bonus_date')

        con = get_connection()
        cursor = con.cursor()
        query = """
            UPDATE Bonus 
            SET bonus_type=%s, amount=%s, bonus_date=%s, description=%s
            WHERE id=%s
        """
        cursor.execute(query, (bonus_type, amount, bonus_date, description, bonus_id))
        con.commit()
        return jsonify({"message": "Bonus updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        con.close()


@app.route('/bonus/<int:bonus_id>', methods=['DELETE'])
def delete_bonus(bonus_id):
    try:
        con = get_connection()
        cursor = con.cursor()
        query = "DELETE FROM Bonus WHERE id=%s"
        cursor.execute(query, (bonus_id,))
        con.commit()
        return jsonify({"message": "Bonus deleted successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        con.close()





@app.route('/basic_salary', methods=['GET'])
def get_basic_salary():
    try:
        con = get_connection()
        cursor = con.cursor(dictionary=True)
        cursor.execute("""
            SELECT id AS employee_id, employee_no, firstname, lastname, salary 
            FROM EmployeeInformation
        """)
        result = cursor.fetchall()
        return jsonify({"basic_salary": result})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        con.close()





if __name__ == "__main__":
    app.run(debug=True)



# @app.route('/add_student',methods=['POST'])
# def add_student_to_db():
#     try:
#             con=request.get_json()
#             name=con['name']
#             class_name=con['class_name']
#             section=con['section']
#             con=get_connection()
#             cursor=con.cursor()

#             # check if class_id exists in class table

#             cursor.execute("SELECT CLASS_ID FROM class WHERE CLASS_NAME=%s AND SECTION=%s",(class_name,section))
#             result=cursor.fetchone()

#             if not result:
#                   response={
#                         "error":f"class {class_name}  with section {section} doesn't exist in class table.please provide valid values"
#                         }
                  
                  
#             else:
#                     class_id=result[0]
#                     query="INSERT INTO student (NAME,CLASS_ID) VALUES (%s,%s)"
#                     values=(name,class_id)
#                     cursor.execute(query,values)
#                     con.commit()

#                     student_id=cursor.lastrowid

#                     response={
#                           "message":f"Student {name} added successfully with id {student_id}.",
#                           "student_id":student_id,
#                           "name":name,
#                           "class_id":class_id
#                     }

#     except Exception as e:
#             response={"error":str(e)}

#     finally:
#             cursor.close()
#             con.close()
#             return response
    

    

# @app.route('/get_students', methods=['GET'])
# def get_student_from_db():
#     try:
#         con = get_connection()
#         cursor = con.cursor()

#         # join with class table to get class_name & section
#         query = """
#             SELECT s.STUDENT_ID, s.NAME, c.CLASS_NAME, c.SECTION
#             FROM student s
#             JOIN class c ON s.CLASS_ID = c.CLASS_ID
#         """
#         cursor.execute(query)
#         results = cursor.fetchall()

#         students = []
#         for row in results:
#             students.append({
#                 "student_id": row[0],
#                 "student_name": row[1],
#                 "class_name": row[2],
#                 "section": row[3]
#             })

#         response = {"student": students}

#     except Exception as e:
#         response = {"error": str(e)}

#     finally:
#         cursor.close()
#         con.close()
#         return jsonify(response)
    




# @app.route('/add_class',methods=['POST'])
# def add_class_to_db():
#     try:
#             con=request.get_json()
#             class_name=con['class_name']
#             section=con['section']
#             con=get_connection()
#             cursor=con.cursor()
#             query="INSERT INTO class (CLASS_NAME,SECTION) VALUES(%s,%s)"
#             values=(class_name,section)
#             cursor.execute(query,values)
#             con.commit()
#             class_id=cursor.lastrowid
#             response={"message":f"class {class_name} - {section} added successfully with id {class_id} "}

#     except Exception as e:
#             response={"error":str(e)}
            
#     finally:
#                 cursor.close()
#                 con.close()
#                 return response
    


    
# @app.route('/get_classes',methods=['GET'])
# def get_class_from_db():
#     try:
#             con=get_connection()
#             cursor=con.cursor()
#             query="SELECT * FROM class"
#             cursor.execute(query)
#             results = cursor.fetchall()
#             classes = []
#             for row in results:
#                 classes.append({
#                     "class_id": row[0],
#                     "class_name": row[1],
#                     "section": row[2]
#                 })

#             response = {"classes": classes}
            
#     except Exception as e:
#             response={"error":str(e)}
            
#     finally:
#                 cursor.close()
#                 con.close()
#                 return jsonify(response)





# @app.route('/add_subject', methods=['POST'])
# def add_subject_to_db():
#     try:
#         data = request.get_json()
#         sub_name = data.get("sub_name")
#         class_id = data.get("class_id")
#         con = get_connection()
#         cursor = con.cursor()

#         query = "INSERT INTO subject (SUB_NAME) VALUES(%s)"
#         values = (sub_name,)
#         cursor.execute(query, values)
#         con.commit()

#         subject_id = cursor.lastrowid
#         query_alloc = "INSERT INTO subject_allocation (class_id, subject_id) VALUES (%s, %s)"
#         cursor.execute(query_alloc, (class_id, subject_id))
#         con.commit()
#         response = {"message": f"Subject {sub_name} added successfully", "subject_id": subject_id}

#     except Exception as e:
#         response = {"error": str(e)}

#     finally:
#         cursor.close()
#         con.close()
#         return jsonify(response)


# @app.route('/get_subjects', methods=['GET'])
# def get_subjects():
#     try:
#         con = get_connection()
#         cursor = con.cursor()

#         query = "SELECT SUBJECT_ID, SUB_NAME FROM subject"
#         cursor.execute(query)
#         results = cursor.fetchall()

#         subjects = []
#         for row in results:
#             subjects.append({
#                 "subject_id": row[0],
#                 "subject_name": row[1]
#             })

#         response = {"subjects": subjects}

#     except Exception as e:
#         response = {"error": str(e)}

#     finally:
#         cursor.close()
#         con.close()
#         return jsonify(response)


# @app.route('/allocate_subjects', methods=['POST'])
# def allocate_subjects():
#     try:
#         data = request.json
#         class_id = data.get("class_id")
#         subject_ids = data.get("subject_ids", [])  # expecting a list

#         con = get_connection()
#         cursor = con.cursor()

#         for subject_id in subject_ids:
#             query = """
#                 INSERT INTO subject_allocation (class_id, subject_id) 
#                 VALUES (%s, %s)
#                 ON DUPLICATE KEY UPDATE subject_id = subject_id
#             """
#             cursor.execute(query, (class_id, subject_id))

#         con.commit()
#         response = {"message": "Subjects allocated successfully"}

#     except Exception as e:
#         response = {"error": str(e)}

#     finally:
#         cursor.close()
#         con.close()
#         return jsonify(response)


# @app.route('/get_allocated_subjects', methods=['GET'])
# def get_allocated_subjects():
#     try:
#         class_id = request.args.get("class_id", type=int)
#         section = request.args.get("section")

#         if not class_id or not section:
#             return jsonify({"error": "class_id and section are required parameters"}), 400

#         con = get_connection()
#         cursor = con.cursor()

#         query = """
#             SELECT sa.id, s.SUBJECT_ID, s.SUB_NAME, c.CLASS_NAME, c.SECTION
#             FROM subject_allocation sa
#             JOIN subject s ON sa.subject_id = s.SUBJECT_ID
#             JOIN class c ON sa.class_id = c.CLASS_ID
#             WHERE sa.class_id = %s AND c.SECTION = %s
#         """
#         cursor.execute(query, (class_id, section))
#         results = cursor.fetchall()

#         allocations = []
#         for row in results:
#             allocations.append({
#                 "allocation_id": row[0],
#                 "subject_id": row[1],
#                 "subject_name": row[2],
#                 "class_name": row[3],
#                 "section": row[4]
#             })

#         response = {"subjects": allocations}

#     except Exception as e:
#         response = {"error": str(e)}

#     finally:
#         cursor.close()
#         con.close()
#         return jsonify(response)
    

# @app.route('/get_exam_type',methods=['GET'])
# def get_exam_type_from_db():
#     try:
#             con=get_connection()
#             cursor=con.cursor()
#             query="SELECT * FROM exam_type"
#             cursor.execute(query)
#             results = cursor.fetchall()
#             classes = []
#             for row in results:
#                 classes.append({
#                     "exam_type_id": row[0],
#                     "exam_name": row[1],
                   
#                 })

#             response = {"exam_type": classes}
#             print(response)
            
#     except Exception as e:
#             response={"error":str(e)}
            
#     finally:
#                 cursor.close()
#                 con.close()
#                 return jsonify(response)
    




 

# @app.route('/add_marks',methods=['post'])
# def add_marks_to_db():
#         con=request.get_json()
#         st_id=con['st_id']
#         sub_id=con['sub_id']
#         exam_type_id=con['exam_type_id']
#         marks=con['marks']
#         con = get_connection()
#         cursor = con.cursor()

#         query_exam_type = "SELECT * FROM exam_type WHERE EXAM_TYPE_ID=%s"
#         cursor.execute(query_exam_type, (exam_type_id,))
#         exam_type = cursor.fetchone()

#         if not exam_type:
#             response={"message":"Invalid exam type ID. please provide a valid exam type ID."}
#             cursor.close()
#             con.close()
#             return jsonify(response)

#         # Check if record already exists
#         query_check = "SELECT * FROM student_marks_details WHERE ST_ID=%s AND SUB_ID=%s AND EXAM_TYPE_ID=%s"
#         cursor.execute(query_check, (st_id, sub_id, exam_type_id))
#         result = cursor.fetchone()

#         if result:
#             response={"message":"Marks record already exists. Skipping insert."}
#             cursor.close()
#             con.close()
#             return jsonify(response)
#         else:
#             query = "INSERT INTO student_marks_details(ST_ID,SUB_ID,EXAM_TYPE_ID,MARKS) VALUES(%s,%s,%s,%s)"
#             values = (st_id, sub_id, exam_type_id, marks)
#             cursor.execute(query, values)
#             con.commit()
#             response={"message":f"Marks {marks} added successfully."}
#             cursor.close()
#             con.close()
#             return jsonify(response)
        


# @app.route('/get_add_marks',methods=['GET'])
# def get_add_marks_from_db():
#     try:
#             con=get_connection()
#             cursor=con.cursor()
#             query="SELECT * FROM student_marks_details"
#             cursor.execute(query)
#             results = cursor.fetchall()
#             classes = []
#             for row in results:
#                 classes.append({
#                    "subject_id": row[0],
#                     "subject_name": row[1],
#                     "exam_type_id": row[2],
#                     "marks": row[3]
                   
#                 })

#             response = {"add_marks": classes}
            
#     except Exception as e:
#             response={"error":str(e)}
            
#     finally:
#                 cursor.close()
#                 con.close()
#                 return jsonify(response)
            
  

# @app.route('/calculate_percentage',methods=['GET'])
# def calculate_percentage():
#         con=get_connection()
#         cursor=con.cursor()

#         query="""
#         SELECT s.STUDENT_ID, s.NAME, 
#             SUM(m.MARKS) AS total_obtained , 
#             COUNT(DISTINCT m.SUB_ID) * 100 AS total_marks
#         FROM student s
#         JOIN student_marks_details m ON s.STUDENT_ID = m.ST_ID
#         GROUP BY s.STUDENT_ID, s.NAME
#         """

#         cursor.execute(query)
#         results=cursor.fetchall()

#         response={"message":"\nStudent Percentage Report:"}

#         if results:
    
#          for student_id,name,obtained,total in results:
#             if total>0:
#                 percentage=(obtained/total)*100
#                 response={"message":f"{name} (ID:{student_id}) -> {percentage:.2f}%"}
#             else:
#                 response={"message":f"{name} (ID:{student_id}) -> NO marks available"}

#         else:
#             response={"message":"No student marks available."}

#         cursor.close()
#         con.close()
#         return jsonify(response)    
# # if __name__=="__main__":

# #         calculate_percentage()
# #         app.run(debug=True)


