export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifica tu Correo Electrónico</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
  </style>
</head>
<body style="font-family: 'Lato', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #446AAB, #5c7ebd); align-items: center; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Verifica tu Correo Electrónico</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p style="font-size: 18px;">Hola, ¡Gracias por registrarte! Tu código de verificación es:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 36px; font-weight: 600; color: #446AAB;">{verificationCode}</span>
    </div>
    <p style="font-size: 18px;">Ingresa este código en la página de verificación para completar tu registro.</p>
    <p style="font-size: 18px;">Este código expirará en 15 minutos por razones de seguridad.</p>
    <p style="font-size: 18px;">Si no creaste una cuenta con nosotros, por favor ignora este correo.</p>
    <p style="font-size: 18px;">Saludos,<br>universoexplora Team 😎✨</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
  </div>
</body>
</html>
`;

export const WELCOME_NEW_USER_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

    body {
      font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      background: linear-gradient(to right, #446AAB, #5c7ebd);
      padding: 20px;
      text-align: center;
      justify-content: center;
      align-items: center;
    }

    .header img {
      width: 5rem;
      pointer-events: none;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .content {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .content p {
      font-size: 18px;
    }

    .content a {
      color: #446AAB;
      font-weight: bold;
      text-decoration: none;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 0.8em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>¡Bienvenid@ a universo universoexplora!</h1>
  </div>
  <div class="content">
    <p>Hola {name},</p>
    <p>Nos alegra mucho tenerte con nosotros. Tu cuenta ha sido creada exitosamente y estás listo para empezar.</p>
    <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. Puedes encontrarnos en nuestro sitio web en la sección de contacto.</p>
    <p>¡Gracias por unirte a nuestra comunidad!</p>
    <p>Saludos,<br>universoexplora Team 😎✨.</p>
  </div>
  <div class="footer">
    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecimiento de Contraseña Exitoso</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
  </style>
</head>
<body style="font-family: 'Lato', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #5cb85c; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Restablecimiento de Contraseña Exitoso</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p style="font-size: 18px;">Hola,</p>
    <p style="font-size: 18px;">Te escribimos para confirmar que tu contraseña ha sido restablecida con éxito.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #5cb85c; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p style="font-size: 18px;">Si no iniciaste este restablecimiento de contraseña, por favor contacta a nuestro equipo de soporte de inmediato.</p>
    <p style="font-size: 18px;">Por razones de seguridad, te recomendamos que:</p>
    <ul style="font-size: 18px;">
      <li>Utilices una contraseña fuerte y única</li>
      <li>Habilites la autenticación de dos factores si está disponible</li>
      <li>Evites usar la misma contraseña en varios sitios</li>
    </ul>
    <p style="font-size: 18px;">Gracias por ayudarnos a mantener la seguridad de tu cuenta.</p>
    <p style="font-size: 18px;">Saludos,<br>universoexplora Team 😎✨</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablece tu Contraseña</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
  </style>
</head>
<body style="font-family: 'Lato', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #446AAB, #5c7ebd); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Restablecimiento de Contraseña</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p style="font-size: 18px;">Hola,</p>
    <p style="font-size: 18px;">Recibimos una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, por favor ignora este correo.</p>
    <p style="font-size: 18px;">Para restablecer tu contraseña, haz clic en el botón de abajo:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetUrl}" style="background-color: #446AAB; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 18px;">Restablecer Contraseña</a>
    </div>
    <p style="font-size: 18px;">Este enlace expirará en 1 hora por razones de seguridad.</p>
    <p style="font-size: 18px;">Saludos,<br>universoexplora Team 😎✨</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
  </div>
</body>
</html>
`;

export const APPROVAL_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aprobación de Cuenta</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

    body {
      font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      background: linear-gradient(to right, #28a745, #218838);
      padding: 20px;
      text-align: center;
      justify-content: center;
      align-items: center;
    }

    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .content {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .content p {
      font-size: 18px;
    }

    .button-container {
      text-align: center;
      margin: 20px 0;
    }

    .button {
      display: inline-block;
      background-color: #28a745;
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      font-size: 18px;
    }

    .button:hover {
      background-color: #218838;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 0.8em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 ¡Tu cuenta ha sido aprobada!</h1>
  </div>
  <div class="content">
    <p>Hola {name} {last_name},</p>
    <p>¡Felicitaciones! Hemos revisado y aprobado tu solicitud para unirte a nuestro equipo de psicólogos en universoexplora.</p>
    <p>Ahora puedes iniciar sesión y comenzar a trabajar con nosotros.</p>
    
    <div class="button-container">
      <a class="button" href="https://app.universoexplora.com/api/auth/login">Iniciar Sesión</a>
    </div>

    <p>Si tienes alguna duda o necesitas asistencia, no dudes en contactarnos.</p>
    <p>Saludos,<br>universoexplora Team 😎✨</p>
  </div>
  <div class="footer">
    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
  </div>
</body>
</html>
`;

export const REJECTION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solicitud Rechazada</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

    body {
      font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      background: linear-gradient(to right, #d9534f, #c9302c);
      padding: 20px;
      text-align: center;
      justify-content: center;
      align-items: center;
    }

    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .content {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .content p {
      font-size: 18px;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 0.8em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Solicitud Rechazada</h1>
  </div>
  <div class="content">
    <p>Hola {name},</p>
    <p>Lamentamos informarte que tu solicitud para unirte a nuestro equipo como psicólogo ha sido rechazada.</p>
    <p><b>Motivo del rechazo:</b></p>
    <p style="color: #c9302c; font-weight: bold;">"{reason}"</p>
    <p>Si crees que ha habido un error o deseas más información, puedes comunicarte con nuestro equipo de soporte.</p>
    <p>Agradecemos tu interés en formar parte de universoexplora.</p>
    <p>Saludos,<br>universoexplora Team 😎✨</p>
  </div>
  <div class="footer">
    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
  </div>
</body>
</html>
`;