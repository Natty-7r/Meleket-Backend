export const changeSpaceByHypen = (text: string): string => {
  return text.replace(/ /g, '-')
}

export const capitalize = (text: string): string =>
  text
    .split(' ')
    .map((word) => word.toLocaleUpperCase())
    .reduce((textCatitalized, wordCapitalized) =>
      textCatitalized.concat(` ${wordCapitalized}`),
    )

export const tolowercaseCustom = (text: string): string =>
  text.toLocaleLowerCase().trim() || text

export const generateVerifyEmailOTPMessage = ({
  firstName,
  otp,
}: {
  firstName: string
  otp: string
}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Account Creation </title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            display: flex;
            justify-content: center;
        }
        .card {
            width: 600px;
            background: #fff;
            border: 1px solid #ddd;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h2 {
            color: #0056b3;
            margin: 0;
        }
        .content p {
            font-size: 16px;
        }
        .otp {
            color: #0056b3;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
        }
        .footer {
            margin-top: 20px;
        }
    </style>
    <script>
        function copyToClipboard() {
            var otp = document.getElementById("otp").innerText;
            navigator.clipboard.writeText(otp).then(function() {
                alert("OTP copied to clipboard!");
            }, function() {
                alert("Failed to copy OTP. Please try again.");
            });
        }
    </script>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h2>New Account Creation - Notification</h2>
            </div>
            <div class="content">
                <p>Dear ${firstName},</p>
                <p>Your OTP for account verification is: 
                    <span id="otp" class="otp" onclick="copyToClipboard()">${otp}</span>
                    <br>Please enter this code to complete your verification process.
                </p>
                <p>If you have any questions or need further assistance, please contact our support team.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The MELEKET (መለከት) ADD-BOARD Team</p>
            </div>
        </div>
    </div>
</body>
</html>
`
}
export const generateResetEmailOTPMessage = ({
  firstName,
  otp,
}: {
  firstName: string
  otp: string
}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            display: flex;
            justify-content: center;
        }
        .card {
            width: 600px;
            background: #fff;
            border: 1px solid #ddd;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h2 {
            color: #0056b3;
            margin: 0;
        }
        .content p {
            font-size: 16px;
        }
        .otp {
            color: #0056b3;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
        }
        .footer {
            margin-top: 20px;
        }
    </style>
    <script>
        function copyToClipboard() {
            var otp = document.getElementById("otp").innerText;
            navigator.clipboard.writeText(otp).then(function() {
                alert("OTP copied to clipboard!");
            }, function() {
                alert("Failed to copy OTP. Please try again.");
            });
        }
    </script>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h2>Password Reset - Notification</h2>
            </div>
            <div class="content">
                <p>Dear ${firstName},</p>
                <p>We received a request to reset your password. Your OTP for password reset is: 
                    <span id="otp" class="otp" onclick="copyToClipboard()">${otp}</span>
                </p>
                <p>Please enter this code to complete your password reset process.</p>
                <p>If you did not request this reset, please ignore this email.</p>
                <p>If you have any questions or need further assistance, please contact our support team.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The MELEKET (መለከት) ADD-BOARD Team</p>
            </div>
        </div>
    </div>
</body>
</html>
`
}
export const generateAccountCreationEmailMessage = ({
  firstName,
  password,
}: {
  firstName: string
  password: string
}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Account Creation - Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            display: flex;
            justify-content: center;
        }
        .card {
            width: 600px;
            background: #fff;
            border: 1px solid #ddd;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h2 {
            color: #0056b3;
            margin: 0;
        }
        .content p {
            font-size: 16px;
        }
        .password {
            color: #0056b3;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
        }
        .footer {
            margin-top: 20px;
        }
    </style>
    <script>
        function copyToClipboard() {
            var password = document.getElementById("password").innerText;
            navigator.clipboard.writeText(password).then(function() {
                alert("Password copied to clipboard!");
            }, function() {
                alert("Failed to copy password. Please try again.");
            });
        }
    </script>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <h2>Admin Account Creation - Notification</h2>
            </div>
            <div class="content">
                <p>Dear ${firstName},</p>
                <p>Your admin account has been created successfully. Below is your default password:</p>
                <p><span id="password" class="password" onclick="copyToClipboard()">${password}</span></p>
                <p>Please use this password to log in and change it immediately. Your account will remain inactive until you update your password.</p>
                <p>If you did not request this account or have any questions, please contact our support team.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The MELEKET (መለከት) ADD-BOARD Team</p>
            </div>
        </div>
    </div>
</body>
</html>
`
}
export const generateAccountCreationSMSMessage = ({
  firstName,
  password,
}: {
  firstName: string
  password: string
}) => {
  return `Admin Account Creation Notification

Dear ${firstName},

Your admin account has been created. Your default password is: ${password}

Please log in and change your password immediately to activate your account. Your account will remain inactive until you do so.

If you did not request this account or need assistance, contact our support team.

Best regards,
The MELEKET (መለከት) ADD-BOARD Team`
}
export const generateVerifySMSOTPMessage = ({
  firstName,
  otp,
}: {
  firstName: string
  otp: string
}): string => {
  return `
  New Account Creation

  Dear ${firstName}, your OTP for account verification is ${otp}. Enter this code to complete the process. For assistance, contact our support team.

 Best regards,
  The MELEKET (መለከት) ADD-BOARD Team`
}
export const generateResetSMSOTPMessage = ({
  firstName,
  otp,
}: {
  firstName: string
  otp: string
}): string => {
  return `Password Reset

Dear ${firstName}, your OTP for resetting your password is ${otp}. Enter this code to reset your password. If you did not request this, ignore this message.

Best regards,
The MELEKET (መለከት) ADD-BOARD Team`
}
