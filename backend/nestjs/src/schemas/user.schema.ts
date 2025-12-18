import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ 
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ sparse: true, trim: true })
  phone: string;

  @Prop()
  avatar: string;

  @Prop({ enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop()
  dateOfBirth: Date;

  @Prop({ type: [Object], default: [] })
  addresses: {
    id: string;
    fullName: string;
    phone: string;
    province: string;
    provinceCode: string;
    district: string;
    districtCode: string;
    ward: string;
    wardCode: string;
    address: string;
    isDefault: boolean;
  }[];

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ enum: ['customer', 'admin'], default: 'customer' })
  role: string;

  @Prop()
  lastLoginAt: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExpires: Date;

  @Prop()
  emailVerificationToken: string;

  // Virtual for full name
  get fullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual
UserSchema.virtual('fullName').get(function() {
  return `${this.lastName} ${this.firstName}`;
});

// Transform
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete (ret as any).password;
    delete (ret as any).passwordResetToken;
    delete (ret as any).passwordResetExpires;
    delete (ret as any).emailVerificationToken;
    delete (ret as any).__v;
    return ret;
  },
});
