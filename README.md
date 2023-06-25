# Login-Register-Auth
simple login and register auth router, using mails and otp verifications

#register
fill in the correct details and click enter
an otp will be sent to the provided email for user verification
verify the otp then u can use the login route

#login
enter the correct details and the verifications will be done and then a token is craeted for the user

#forgot password
if a user forgot the password you can use the forgot password route 
user provides an email, and the database is searched for the email, if the email exists an otp will be sent to the email provided
confirm the email using the otp and a token will be generated for the change of password for the current user

#resend otp
a user can request a new otp if the previous otp has expired or is not valid again
the previous otp is then deleted and the new otp is saved for use
