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

non_admin_uid = '100'


def _api_evaluation_types(client, expected_status_code=200):
    response = client.get('/api/evaluation_types')
    assert response.status_code == expected_status_code
    return response.json


class TestEvaluationTypes:

    def test_anonymous(self, client):
        """Denies anonymous user."""
        _api_evaluation_types(client, expected_status_code=401)

    def test_authorized(self, client, fake_auth):
        fake_auth.login(non_admin_uid)
        eval_types = _api_evaluation_types(client)
        assert len(eval_types) == 14
        for e in eval_types:
            assert e['id']
            assert e['name']
            assert e['createdAt']
            assert e['updatedAt']
        assert next(e for e in eval_types if e['name'] == 'F')
        assert next(e for e in eval_types if e['name'] == '3A')