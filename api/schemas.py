from marshmallow import Schema, fields, validate, ValidationError
from config import ma
from models import User
import phonenumbers
import re

class UserSchema(ma.Schema):
    def validate_email(value):
        email=User.query.filter(User.email == value).first() is None
        if email:
            return True
        else:
            raise ValidationError("Email already registered")

    def validate_username(value):
        username=User.query.filter(User.username == value).first() is None
        if username:
            return True
        else:
            raise ValidationError("Username not available")

    def validate_phone(value):
        number=phonenumbers.parse(value, "IN")
        if phonenumbers.is_valid_number(number):
            return True
        else:
            raise ValidationError("Phone Number is not valid for India")

    def validate_password(value):
        reg = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{6,20}$"
        pat = re.compile(reg)
        mat = re.search(pat, value)
        if mat:
            return True
        else:
            raise ValidationError("Password Invalid")

    class Meta:
        fields = ("id","name", "username", "email", "password", "image", "address", "phone")
    id = fields.String(dump_only=True)
    name = fields.String(required=True, validate=[validate.Length(1,255)])
    username = fields.String(required=False, validate=[validate_username,validate.Length(min=8,max=30,error="Username length must be between 8 to 20")])
    email = fields.Email(required=True, validate=[validate_email,validate.Length(1,255)])
    password = fields.String(required=False, validate=[validate_password,validate.Length(min=8,max=20,error="Password length must be between 8 to 20")])
    image = fields.String(required=False, validate=[validate.Length(1,255)])
    address = fields.String(required=False, validate=[validate.Length(1,255)])
    phone = fields.String(required=False, validate=[validate_phone,validate.Length(10,13)])



class TaskSchema(ma.Schema):
    class Meta:
        # model=Task
        fields = ("id","title", "creater", 'assigned', "description", "status")
    id = fields.String(dump_only=True)
    title = fields.String(required=True, validate=[validate.Length(1,50)])
    creater = fields.String(required=True, validate=[validate.Length(1,50)])
    assigned = fields.String(required=True, validate=[validate.Length(1,50)])
    description = fields.String(required=True, validate=[validate.Length(1,500)])
    status = fields.String(required=True, validate=[validate.OneOf(["Open", "In Progress", "Hold", "Closed"])])
