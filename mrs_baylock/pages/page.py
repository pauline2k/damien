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

import time

from flask import current_app as app
from mrs_baylock.test_utils import utils
from selenium.common import exceptions
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import WebDriverWait as Wait


class Page(object):

    def __init__(self, driver):
        self.driver = driver

    PAGE_HEADING = (By.XPATH, '//h1')

    def element(self, locator):
        strategy = locator[0]
        target = locator[1]
        if strategy == 'id':
            return self.driver.find_element_by_id(target)
        elif strategy == 'name':
            return self.driver.find_element_by_name(target)
        elif strategy == 'class name':
            return self.driver.find_element_by_class_name(target)
        elif strategy == 'link text':
            return self.driver.find_element_by_link_text(target)
        elif strategy == 'partial link text':
            return self.driver.find_element_by_partial_link_text(target)
        elif strategy == 'xpath':
            return self.driver.find_element_by_xpath(target)

    def elements(self, locator):
        strategy = locator[0]
        target = locator[1]
        if strategy == 'id':
            return self.driver.find_elements_by_id(target)
        elif strategy == 'name':
            return self.driver.find_elements_by_name(target)
        elif strategy == 'class name':
            return self.driver.find_elements_by_class_name(target)
        elif strategy == 'link text':
            return self.driver.find_elements_by_link_text(target)
        elif strategy == 'partial link text':
            return self.driver.find_elements_by_partial_link_text(target)
        elif strategy == 'xpath':
            return self.driver.find_elements_by_xpath(target)

    def is_present(self, locator):
        try:
            self.element(locator)
            return True
        except exceptions.NoSuchElementException:
            return False

    def when_not_present(self, locator, timeout):
        tries = 0
        while tries <= timeout:
            tries += 1
            try:
                assert not self.is_present(locator)
                break
            except AssertionError:
                if tries == timeout:
                    raise
                else:
                    time.sleep(1)

    def wait_for_element(self, locator, timeout):
        if utils.get_browser() == 'chrome':
            for entry in self.driver.get_log('browser'):
                if app.config['BASE_URL'] in entry:
                    app.logger.warning(f'Console error: {entry}')
        Wait(self.driver, timeout).until(
            method=ec.presence_of_element_located(locator),
            message=f'Failed wait for presence_of_element_located: {str(locator)}',
        )
        Wait(self.driver, timeout).until(
            method=ec.visibility_of_element_located(locator),
            message=f'Failed wait for visibility_of_element_located: {str(locator)}',
        )

    def wait_for_text_in_element(self, locator, string):
        tries = 0
        retries = utils.get_short_timeout()
        while tries <= retries:
            tries += 1
            try:
                assert string in self.element(locator).get_attribute('innerText')
                break
            except AssertionError:
                if tries == retries:
                    raise
                else:
                    time.sleep(1)

    def wait_for_title_containing(self, string):
        Wait(self.driver, utils.get_medium_timeout()).until(ec.title_contains(string))

    def click_element(self, locator, addl_pause=None):
        sleep_default = app.config['CLICK_SLEEP']
        time.sleep(addl_pause or sleep_default)
        Wait(driver=self.driver, timeout=utils.get_short_timeout()).until(
            method=ec.element_to_be_clickable(locator),
            message=f'Failed to click_element: {str(locator)}',
        )
        time.sleep(addl_pause or sleep_default)
        self.element(locator).click()

    def click_element_js(self, locator, addl_pause=None):
        sleep_default = app.config['CLICK_SLEEP']
        time.sleep(addl_pause or sleep_default)
        self.driver.execute_script('arguments[0].click();', self.element(locator))

    def wait_for_page_and_click(self, locator, addl_pause=None):
        self.wait_for_element(locator, utils.get_medium_timeout())
        self.click_element(locator, addl_pause)

    def wait_for_page_and_click_js(self, locator, addl_pause=None):
        self.wait_for_element(locator, utils.get_medium_timeout())
        self.click_element_js(locator, addl_pause)

    def wait_for_element_and_click(self, locator, addl_pause=None):
        self.wait_for_element(locator, utils.get_short_timeout())
        self.click_element(locator, addl_pause)

    def wait_for_element_and_type(self, locator, string, addl_pause=None):
        self.wait_for_element_and_click(locator, addl_pause)
        self.element(locator).clear()
        self.element(locator).send_keys(string)

    def wait_for_element_and_type_js(self, element_id, string, addl_pause=None):
        self.wait_for_page_and_click_js((By.ID, element_id), addl_pause)
        self.driver.execute_script(f"document.getElementById('{element_id}').value='{string}'")

    # PAGE TITLE AND HEADING

    def title(self):
        return self.driver.title

    def wait_for_title(self, string):
        app.logger.info(f"'Waiting for page title '{string}'")
        Wait(self.driver, utils.get_short_timeout()).until(
            method=(ec.title_is(string)),
            message=f'Failed wait_for_title: {string}',
        )

    def wait_for_title_contains(self, string):
        app.logger.info(f"Waiting for page title containing '{string}")
        Wait(self.driver, utils.get_short_timeout()).until(
            method=(ec.title_contains(string)),
            message=f'Failed wait_for_title_contains: {string}',
        )

    def visible_heading(self):
        return self.element(Page.PAGE_HEADING).text

    # NAVIGATION AND KEYSTROKES

    def reload_page(self):
        self.driver.refresh()

    def scroll_to_top(self):
        self.driver.execute_script('window.scrollTo(0, 0);')

    def scroll_to_bottom(self):
        self.driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')

    def mouseover(self, element):
        ActionChains(self.driver).move_to_element(element).perform()

    def hit_enter(self):
        ActionChains(self.driver).send_keys(Keys.ENTER).perform()

    def hit_escape(self):
        ActionChains(self.driver).send_keys(Keys.ESCAPE).perform()