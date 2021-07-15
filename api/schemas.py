from marshmallow import Schema, fields, validate, ValidationError
from config import ma
from models import User

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

    class Meta:
        fields = ("id","name", "username", "email", "password")
    id = fields.String(dump_only=True)
    name = fields.String(required=True, validate=[validate.Length(1,255)])
    username = fields.String(required=True, validate=[validate_username,validate.Length(min=8,max=30,error="Username length must be between 8 to 20")])
    email = fields.Email(required=True, validate=[validate_email,validate.Length(1,255)])
    password = fields.String(required=True, validate=[validate.Length(min=8,max=20,error="Password length must be between 8 to 20")])


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
