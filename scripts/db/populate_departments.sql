/**
 * Copyright ©2022. The Regents of the University of California (Regents). All Rights Reserved.
 *
 * Permission to use, copy, modify, and distribute this software and its documentation
 * for educational, research, and not-for-profit purposes, without fee and without a
 * signed licensing agreement, is hereby granted, provided that the above copyright
 * notice, this paragraph and the following two paragraphs appear in all copies, TRUE),
 * modifications, and distributions.
 *
 * Contact The Office of Technology Licensing, UC Berkeley, 2150 Shattuck Avenue, TRUE),
 * Suite 510, Berkeley, CA 94720-1620, (510) 643-7201, otl@berkeley.edu, TRUE),
 * http://ipira.berkeley.edu/industry-info for commercial licensing opportunities.
 *
 * IN NO EVENT SHALL REGENTS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, TRUE),
 * INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF
 * THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF REGENTS HAS BEEN ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * REGENTS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE
 * SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED HEREUNDER IS PROVIDED
 * "AS IS". REGENTS HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, TRUE),
 * ENHANCEMENTS, OR MODIFICATIONS.
 */

BEGIN;

TRUNCATE TABLE department_catalog_listings;
TRUNCATE TABLE departments CASCADE;

INSERT INTO departments (dept_name, is_enrolled) VALUES
  ('African American Studies', TRUE),
  ('Agricultural and Resource Economics', TRUE),
  ('American Studies', TRUE),
  ('Ancient Greek and Roman Studies', TRUE),
  ('Ancient History and Mediterranean Archaeology', FALSE),
  ('Anthropology', TRUE),
  ('Architecture', TRUE),
  ('Art Practice', TRUE),
  ('Astronomy', TRUE),
  ('Bioengineering', TRUE),
  ('CalTeach', TRUE),
  ('Celtic Studies', TRUE),
  ('Chemical and Biomolecular Engineering', TRUE),
  ('Chemistry', TRUE),
  ('City and Regional Planning', TRUE),
  ('Civil and Environmental Engineering', TRUE),
  ('College Writing', TRUE),
  ('Comparative Literature', TRUE),
  ('Computational Biology', TRUE),
  ('Computing, Data Science, and Society', TRUE),
  ('Critical Theory', FALSE),
  ('Demography', TRUE),
  ('Digital Humanities', TRUE),
  ('Earth and Planetary Science', TRUE),
  ('East Asian Languages and Cultures', TRUE),
  ('Economics', TRUE),
  ('Education', TRUE),
  ('Electrical Engineering and Computer Sciences', TRUE),
  ('Energy and Resources Group', TRUE),
  ('Engineering', TRUE),
  ('English', TRUE),
  ('Environmental Design', FALSE),
  ('Environmental Science, Policy and Management', TRUE),
  ('Ethnic Studies', TRUE),
  ('Film and Media', TRUE),
  ('French', TRUE),
  ('Freshman and Sophomore Seminars', TRUE),
  ('Gender and Women''s Studies', TRUE),
  ('Geography', TRUE),
  ('German', TRUE),
  ('Global Metropolitan Studies', TRUE),
  ('Goldman School of Public Policy', FALSE),
  ('Graduate Division', TRUE),
  ('Haas School of Business', FALSE),
  ('Helen Wills Neuroscience', TRUE),
  ('History', TRUE),
  ('History of Art', TRUE),
  ('Industrial Engineering and Operations Research', TRUE),
  ('Information', TRUE),
  ('Integrative Biology', TRUE),
  ('Interdisciplinary Studies Field', TRUE),
  ('International and Area Studies', TRUE),
  ('Italian Studies', TRUE),
  ('Jewish Studies', TRUE),
  ('Journalism', TRUE),
  ('L&S Arts and Humanities', TRUE),
  ('Landscape Architecture and Environmental Planning', FALSE),
  ('Law', FALSE),
  ('Legal Studies', TRUE),
  ('Linguistics', TRUE),
  ('Materials Science and Engineering', TRUE),
  ('Mathematics', TRUE),
  ('Mechanical Engineering', TRUE),
  ('Media Studies', TRUE),
  ('Medieval Studies', FALSE),
  ('Middle Eastern Languages and Cultures', TRUE),
  ('Military Affairs', TRUE),
  ('Molecular and Cell Biology', TRUE),
  ('Music', TRUE),
  ('Nanosciences and Nanoengineering Institute', FALSE),
  ('Natural Resources', FALSE),
  ('New Media', TRUE),
  ('Nuclear Engineering', TRUE),
  ('Nutritional Sciences and Toxicology', TRUE),
  ('Optometry', FALSE),
  ('Philosophy', TRUE),
  ('Physical Education', TRUE),
  ('Physics', TRUE),
  ('Plant and Microbial Biology', TRUE),
  ('Political Science', TRUE),
  ('Psychology', TRUE),
  ('Public Health', TRUE),
  ('QB3 Institute', FALSE),
  ('Real Estate Development and Design', TRUE),
  ('Rhetoric', TRUE),
  ('Scandinavian', TRUE),
  ('Science, Technology, Medicine and Society', FALSE),
  ('Slavic Languages and Literatures', TRUE),
  ('Social Welfare', TRUE),
  ('Sociology', TRUE),
  ('South and Southeast Asian Studies', TRUE),
  ('Spanish and Portuguese', TRUE),
  ('Statistics', TRUE),
  ('Theater, Dance and Performance Studies', TRUE),
  ('Undergraduate and Interdisciplinary Studies', TRUE);

WITH listings (dept_name, subject_area, catalog_id) AS (VALUES
  ('African American Studies', 'AFRICAM', NULL),
  ('Agricultural and Resource Economics', 'ARESEC', NULL),
  ('Agricultural and Resource Economics', 'ENVECON', NULL),
  ('American Studies', 'AMERSTD', NULL),
  ('Ancient Greek and Roman Studies', 'AGRS', NULL),
  ('Ancient Greek and Roman Studies', 'CLASSIC', NULL),
  ('Ancient Greek and Roman Studies', 'GREEK', NULL),
  ('Ancient Greek and Roman Studies', 'LATIN', NULL),
  ('Ancient History and Mediterranean Archaeology', 'AHMA', NULL),
  ('Anthropology', 'ANTHRO', NULL),
  ('Anthropology', 'FOLKLOR', NULL),
  ('Architecture', 'ARCH', NULL),
  ('Architecture', 'ENVDES', NULL),
  ('Architecture', 'VISSTD', NULL),
  ('Art Practice', 'ART', NULL),
  ('Astronomy', 'ASTRON', NULL),
  ('Bioengineering', 'BIOENG', NULL),
  ('CalTeach', 'CALTEACH', NULL),
  ('CalTeach', 'EDSTEM', NULL),
  ('CalTeach', 'EDUC', '130'),
  ('CalTeach', 'EDUC', '131AC'),
  ('CalTeach', 'HISTORY', '138T'),
  ('CalTeach', 'HISTORY', '180T'),
  ('CalTeach', 'HISTORY', '182AT'),
  ('CalTeach', 'UGIS', '82'),
  ('CalTeach', 'UGIS', '187'),
  ('CalTeach', 'UGIS', '188'),
  ('CalTeach', 'UGIS', '189'),
  ('CalTeach', 'UGIS', '303'),
  ('Celtic Studies', 'CELTIC', NULL),
  ('Chemical and Biomolecular Engineering', 'CHMENG', NULL),
  ('Chemistry', 'CHEM', NULL),
  ('City and Regional Planning', 'CYPLAN', NULL),
  ('Civil and Environmental Engineering', 'CIVENG', NULL),
  ('Civil and Environmental Engineering', 'DEVENG', NULL),
  ('College Writing', 'COLWRIT', NULL),
  ('Comparative Literature', 'COMLIT', NULL),
  ('Computational Biology', 'CMPBIO', NULL),
  ('Computing, Data Science, and Society', 'DATA', NULL),
  ('Critical Theory', 'CRITTH', NULL),
  ('Demography', 'DEMOG', NULL),
  ('Digital Humanities', 'DIGHUM', NULL),
  ('Earth and Planetary Science', 'EPS', NULL),
  ('East Asian Languages and Cultures', 'ALTAIC', NULL),
  ('East Asian Languages and Cultures', 'ASIANST', NULL),
  ('East Asian Languages and Cultures', 'BUDDSTD', NULL),
  ('East Asian Languages and Cultures', 'CHINESE', NULL),
  ('East Asian Languages and Cultures', 'EALANG', NULL),
  ('East Asian Languages and Cultures', 'JAPAN', NULL),
  ('East Asian Languages and Cultures', 'KOREAN', NULL),
  ('East Asian Languages and Cultures', 'MONGOLN', NULL),
  ('East Asian Languages and Cultures', 'TIBETAN', NULL),
  ('Economics', 'ECON', NULL),
  ('Education', 'EDUC', NULL),
  ('Education', 'SCMATHE', NULL),
  ('Electrical Engineering and Computer Sciences', 'COMPSCI', NULL),
  ('Electrical Engineering and Computer Sciences', 'EECS', NULL),
  ('Electrical Engineering and Computer Sciences', 'ELENG', NULL),
  ('Energy and Resources Group', 'ENE,RES', NULL),
  ('Engineering', 'AST', NULL),
  ('Engineering', 'DES INV', NULL),
  ('Engineering', 'ENGIN', NULL),
  ('Engineering', 'NSE', NULL),
  ('English', 'CRWRIT', NULL),
  ('English', 'ENGLISH', NULL),
  ('Environmental Science, Policy and Management', 'ENVSCI', NULL),
  ('Environmental Science, Policy and Management', 'ESPM', NULL),
  ('Ethnic Studies', 'ASAMST', NULL),
  ('Ethnic Studies', 'CHICANO', NULL),
  ('Ethnic Studies', 'ETHGRP', NULL),
  ('Ethnic Studies', 'ETHSTD', NULL),
  ('Ethnic Studies', 'NATAMST', NULL),
  ('Film and Media', 'FILM', NULL),
  ('French', 'FRENCH', NULL),
  ('Freshman and Sophomore Seminars', '', '(39|24|84)[A-Z]*'),
  ('Freshman and Sophomore Seminars', 'MCELLBI', '90[A-Z]'),
  ('Freshman and Sophomore Seminars', 'NATAMST', '90[A-Z]'),
  ('Gender and Women''s Studies', 'GWS', NULL),
  ('Gender and Women''s Studies', 'LGBT', NULL),
  ('Geography', 'GEOG', NULL),
  ('German', 'AFRKANS', NULL),
  ('German', 'DUTCH', NULL),
  ('German', 'GERMAN', NULL),
  ('German', 'YIDDISH', NULL),
  ('Global Metropolitan Studies', 'GMS', NULL),
  ('Goldman School of Public Policy', 'PUBPOL', NULL),
  ('Graduate Division', 'COMPBIO', NULL),
  ('Graduate Division', 'GSPDP', NULL),
  ('Graduate Division', 'LANPRO', NULL),
  ('Haas School of Business', 'BUSADM', NULL),
  ('Haas School of Business', 'EWMBA', NULL),
  ('Haas School of Business', 'MBA', NULL),
  ('Haas School of Business', 'MFE', NULL),
  ('Haas School of Business', 'PHDBA', NULL),
  ('Haas School of Business', 'UGBA', NULL),
  ('Haas School of Business', 'XMBA', NULL),
  ('Helen Wills Neuroscience', 'NEUROSC', NULL),
  ('History of Art', 'HISTART', NULL),
  ('History', 'HISTORY', NULL),
  ('Industrial Engineering and Operations Research', 'INDENG', NULL),
  ('Information', 'CYBER', NULL),
  ('Information', 'DATASCI', NULL),
  ('Information', 'INFO', NULL),
  ('Integrative Biology', 'BIOLOGY', '1B'),
  ('Integrative Biology', 'BIOLOGY', '1BL'),
  ('Integrative Biology', 'INTEGBI', NULL),
  ('Interdisciplinary Studies Field', 'ISF', NULL),
  ('International and Area Studies', 'COGSCI', NULL),
  ('International and Area Studies', 'DEVSTD', NULL),
  ('International and Area Studies', 'GLOBAL', NULL),
  ('International and Area Studies', 'GPP', NULL),
  ('International and Area Studies', 'IAS', NULL),
  ('International and Area Studies', 'LATAMST', NULL),
  ('International and Area Studies', 'MESTU', NULL),
  ('International and Area Studies', 'PACS', NULL),
  ('International and Area Studies', 'POLECON', NULL),
  ('Italian Studies', 'ITALIAN', NULL),
  ('Jewish Studies', 'JEWISH', NULL),
  ('Journalism', 'JOURN', NULL),
  ('L&S Arts and Humanities', 'HUM', NULL),
  ('Landscape Architecture and Environmental Planning', 'LD ARCH', NULL),
  ('Law', 'LAW', NULL),
  ('Legal Studies', 'LEGALST', NULL),
  ('Linguistics', 'LINGUIS', NULL),
  ('Materials Science and Engineering', 'MATSCI', NULL),
  ('Mathematics', 'MATH', NULL),
  ('Mechanical Engineering', 'MEC ENG', NULL),
  ('Media Studies', 'MEDIAST', NULL),
  ('Medieval Studies', 'MEDST', NULL),
  ('Middle Eastern Languages and Cultures', 'ARABIC', NULL),
  ('Middle Eastern Languages and Cultures', 'CUNEIF', NULL),
  ('Middle Eastern Languages and Cultures', 'EGYPT', NULL),
  ('Middle Eastern Languages and Cultures', 'HEBREW', NULL),
  ('Middle Eastern Languages and Cultures', 'IRANIAN', NULL),
  ('Middle Eastern Languages and Cultures', 'MELC', NULL),
  ('Middle Eastern Languages and Cultures', 'NESTUD', NULL),
  ('Middle Eastern Languages and Cultures', 'PERSIAN', NULL),
  ('Middle Eastern Languages and Cultures', 'SEMITIC', NULL),
  ('Middle Eastern Languages and Cultures', 'TURKISH', NULL),
  ('Military Affairs', 'AEROSPC', NULL),
  ('Military Affairs', 'MILAFF', NULL),
  ('Military Affairs', 'MILSCI', NULL),
  ('Military Affairs', 'NAVSCI', NULL),
  ('Molecular and Cell Biology', 'BIOLOGY', '1A'),
  ('Molecular and Cell Biology', 'BIOLOGY', '1AL'),
  ('Molecular and Cell Biology', 'MCELLBI', NULL),
  ('Music', 'MUSIC', NULL),
  ('Natural Resources', 'DEVP', NULL),
  ('Natural Resources', 'NATRES', NULL),
  ('New Media', 'NWMEDIA', NULL),
  ('Nuclear Engineering', 'NUC ENG', NULL),
  ('Nutritional Sciences and Toxicology', 'NUSCTX', NULL),
  ('Optometry', 'OPTOM', NULL),
  ('Optometry', 'VISSCI', NULL),
  ('Philosophy', 'PHILOS', NULL),
  ('Physical Education', 'PHYSED', NULL),
  ('Physics', 'PHYSICS', NULL),
  ('Plant and Microbial Biology', 'AGRCHM', NULL),
  ('Plant and Microbial Biology', 'PLANTBI', NULL),
  ('Political Science', 'POL SCI', NULL),
  ('Psychology', 'PSYCH', NULL),
  ('Public Health', 'COMPBIO', '294'),
  ('Public Health', 'HMEDSCI', NULL),
  ('Public Health', 'PBHLTH', NULL),
  ('QB3', 'BIOPHY', NULL),
  ('Real Estate Development and Design', 'LDARCH', '254'),
  ('Real Estate Development and Design', 'RDEV', NULL),
  ('Rhetoric', 'RHETOR', NULL),
  ('Scandinavian', 'DANISH', NULL),
  ('Scandinavian', 'FINNISH', NULL),
  ('Scandinavian', 'ICELAND', NULL),
  ('Scandinavian', 'NORWEGN', NULL),
  ('Scandinavian', 'SCANDIN', NULL),
  ('Scandinavian', 'SWEDISH', NULL),
  ('Science, Technology, Medicine and Society', 'STS', NULL),
  ('Slavic Languages and Literatures', 'ARMENI', NULL),
  ('Slavic Languages and Literatures', 'BOSCRSR', NULL),
  ('Slavic Languages and Literatures', 'BULGARI', NULL),
  ('Slavic Languages and Literatures', 'CZECH', NULL),
  ('Slavic Languages and Literatures', 'EAEURST', NULL),
  ('Slavic Languages and Literatures', 'EURA ST', NULL),
  ('Slavic Languages and Literatures', 'EUST', NULL),
  ('Slavic Languages and Literatures', 'HUNGARI', NULL),
  ('Slavic Languages and Literatures', 'POLISH', NULL),
  ('Slavic Languages and Literatures', 'ROMANI', NULL),
  ('Slavic Languages and Literatures', 'RUSSIAN', NULL),
  ('Slavic Languages and Literatures', 'SLAVIC', NULL),
  ('Social Welfare', 'SOCWEL', NULL),
  ('Sociology', 'SOCIOL', NULL),
  ('South and Southeast Asian Studies', 'BANGLA', NULL),
  ('South and Southeast Asian Studies', 'BURMESE', NULL),
  ('South and Southeast Asian Studies', 'FILIPN', NULL),
  ('South and Southeast Asian Studies', 'HINURD', NULL),
  ('South and Southeast Asian Studies', 'HINDI', NULL),
  ('South and Southeast Asian Studies', 'INDONES', NULL),
  ('South and Southeast Asian Studies', 'KHMER', NULL),
  ('South and Southeast Asian Studies', 'MALAYI', NULL),
  ('South and Southeast Asian Studies', 'PUNJABI', NULL),
  ('South and Southeast Asian Studies', 'SASIAN', NULL),
  ('South and Southeast Asian Studies', 'SSEASN', NULL),
  ('South and Southeast Asian Studies', 'SANSKR', NULL),
  ('South and Southeast Asian Studies', 'SEASIAN', NULL),
  ('South and Southeast Asian Studies', 'TAGALG', NULL),
  ('South and Southeast Asian Studies', 'TAMIL', NULL),
  ('South and Southeast Asian Studies', 'TELUGU', NULL),
  ('South and Southeast Asian Studies', 'THAI', NULL),
  ('South and Southeast Asian Studies', 'URDU', NULL),
  ('South and Southeast Asian Studies', 'VIETNMS', NULL),
  ('Spanish and Portuguese', 'CATALAN', NULL),
  ('Spanish and Portuguese', 'ILA', NULL),
  ('Spanish and Portuguese', 'PORTUG', NULL),
  ('Spanish and Portuguese', 'SPANISH', NULL),
  ('Statistics', 'STAT', NULL),
  ('Theater, Dance and Performance Studies', 'THEATER', NULL),
  ('Undergraduate and Interdisciplinary Studies', 'BIC', NULL),
  ('Undergraduate and Interdisciplinary Studies', 'LS', NULL),
  ('Undergraduate and Interdisciplinary Studies', 'RELIGST', NULL),
  ('Undergraduate and Interdisciplinary Studies', 'UGIS', NULL)
)
INSERT INTO department_catalog_listings
  (department_id, subject_area, catalog_id)
SELECT
  departments.id, listings.subject_area, listings.catalog_id
FROM
  departments JOIN listings ON departments.dept_name = listings.dept_name;

COMMIT;