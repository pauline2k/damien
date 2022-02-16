"""
Copyright ©2022. The Regents of the University of California (Regents). All Rights Reserved.

Permission to use, copy, modify, and distribute this software and its documentation
for educational, research, and not-for-profit purposes, without fee and without a
signed licensing agreement, is hereby granted, provided that the above copyright
notice, this paragraph and the following two paragraphs appear in all copies,
modifications, and distributions.

Contact The Office of Technology Licensing, UC Berkeley, 2150 Shattuck Avenue,
Suite 510, Berkeley, CA 94720-1620, (510) 643-7201, otl@berkeley.edu,
http://ipira.berkeley.edu/industry-info for commercial licensing opportunities.

IN NO EVENT SHALL REGENTS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL,
INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF
THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF REGENTS HAS BEEN ADVISED
OF THE POSSIBILITY OF SUCH DAMAGE.

REGENTS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE
SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED HEREUNDER IS PROVIDED
"AS IS". REGENTS HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES,
ENHANCEMENTS, OR MODIFICATIONS.
"""

from damien import db, std_commit
from flask import current_app as app
from mrsbaylock.models.department import Department
from mrsbaylock.models.user import User
from sqlalchemy import text


def get_browser():
    return app.config['BROWSER']


def browser_is_headless():
    return app.config['BROWSER_HEADLESS']


def get_click_sleep():
    return app.config['CLICK_SLEEP']


def get_short_timeout():
    return app.config['TIMEOUT_SHORT']


def get_medium_timeout():
    return app.config['TIMEOUT_MEDIUM']


def get_long_timeout():
    return app.config['TIMEOUT_LONG']


def get_admin_uid():
    return app.config['ADMIN_UID']


def get_admin_username():
    return app.config['ADMIN_USERNAME']


def get_admin_password():
    return app.config['ADMIN_PASSWORD']


def default_download_dir():
    return f'{app.config["BASE_DIR"]}/mrsbaylock/downloads'


# DATABASE - USERS


def get_user(uid):
    sql = f"SELECT * FROM users WHERE uid = '{uid}'"
    app.logger.info(sql)
    result = db.session.execute(text(sql)).first()
    std_commit(allow_test_environment=True)
    app.logger.info(f'{result}')
    data = {
        'uid': uid,
        'csid': result['csid'],
        'first_name': result['first_name'],
        'last_name': result['last_name'],
        'email': result['email'],
        'is_admin': result['is_admin'],
        'receives_comms': result['can_receive_communications'],
        'views_response_rates': result['can_view_response_rates'],
    }
    return User(data)


def create_admin_user(user):
    sql = f"""
        INSERT INTO users (
            csid, uid, first_name, last_name, email, is_admin, can_receive_communications, can_view_response_rates,
            created_at, updated_at
        )
        SELECT
            '{user.csid}', '{user.uid}', '{user.first_name}', '{user.last_name}', '{user.email}', TRUE, TRUE, TRUE,
            NOW(), NOW()
    """
    app.logger.info(sql)
    db.session.execute(text(sql))
    std_commit(allow_test_environment=True)


def hard_delete_user(user):
    sql = f"DELETE FROM users WHERE uid = '{user.uid}'"
    app.logger.info(sql)
    db.session.execute(text(sql))
    std_commit(allow_test_environment=True)


def soft_delete_user(user):
    sql = f"UPDATE users SET deleted_at = NOW() WHERE uid = '{user.uid}'"
    app.logger.info(sql)
    db.session.execute(text(sql))
    std_commit(allow_test_environment=True)


def restore_user(user):
    sql = f"UPDATE users SET deleted_at = NULL WHERE uid = '{user.uid}'"
    app.logger.info(sql)
    db.session.execute(text(sql))
    std_commit(allow_test_environment=True)


def get_dept_users(dept):
    sql = f"""
        SELECT users.id,
               users.uid,
               users.csid,
               users.first_name,
               users.last_name,
               users.email,
               users.can_receive_communications,
               users.can_view_response_rates
          FROM users
          JOIN department_members ON department_members.user_id = users.id
          JOIN departments ON departments.id = department_members.department_id
         WHERE departments.id = '{dept.dept_id}';
    """
    app.logger.info(sql)
    users = []
    result = db.session.execute(text(sql))
    std_commit(allow_test_environment=True)
    for row in result:
        user_data = {
            'id': row['id'],
            'uid': row['uid'],
            'csid': row['csid'],
            'first_name': row['first_name'],
            'last_name': row['last_name'],
            'email': row['email'],
            'receives_comms': row['can_receive_communications'],
            'views_response_rates': row['can_view_response_rates'],
        }
        user = User(user_data)
        users.append(user)
    return users


def get_dept(name):
    sql = f"""
        SELECT id,
               is_enrolled,
               note
          FROM departments
         WHERE dept_name = '{name}';
    """
    app.logger.info(sql)
    result = db.session.execute(text(sql)).first()
    std_commit(allow_test_environment=True)
    app.logger.info(result)
    dept_data = {
        'id': result['id'],
        'name': name,
        'participating': result['is_enrolled'],
        'note': result['note'],
    }
    dept = Department(dept_data)
    dept.users = get_dept_users(dept)
    return dept


def delete_dept_note(dept):
    sql = f'UPDATE departments SET note = NULL WHERE id = {dept.dept_id};'
    app.logger.info(sql)
    db.session.execute(text(sql))
    std_commit(allow_test_environment=True)
    dept.note = None