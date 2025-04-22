import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  uploadedFiles: { [key: string]: { [type: string]: File } } = {};

  roles = [
    { key: 'partnerDoctor', label: 'Partner Doctor' },
    { key: 'partnerRaider', label: 'Partner Raider' },
    { key: 'customerCare', label: 'Customer Care' },
    { key: 'seller', label: 'Seller' }
  ];

  careerForms: { [key: string]: FormGroup } = {};
  extraForms!: {
    bugReport: FormGroup;
    inquiry: FormGroup;
  };

  constructor(private fb: FormBuilder) { }

  // Update the ngOnInit to disable message fields initially
  ngOnInit(): void {
    this.roles.forEach(role => {
      this.careerForms[role.key] = this.fb.group({
        document: ['', Validators.required],
        picture: ['', Validators.required],
        agree: [false, Validators.requiredTrue]
      });
      this.uploadedFiles[role.key] = {};
    });

    this.extraForms = {
      bugReport: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        message: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(10)]]
      }),
      inquiry: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        message: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(10)]]
      })
    };
  }

  // Simplify the onEmailInput method
  onEmailInput(formKey: keyof typeof this.extraForms): void {
    const form = this.extraForms[formKey];
    const emailControl = form.get('email');
    const messageControl = form.get('message');

    if (emailControl?.valid) {
      messageControl?.enable();
    } else {
      messageControl?.disable();
      messageControl?.reset();
    }
  }

  onSubmit(formKey: string): void {
    if (formKey in this.careerForms) {
      const formValue = this.careerForms[formKey].value;
      console.log(`Career Form Submitted for ${formKey}`, formValue);
    } else if (formKey === 'bugReport' || formKey === 'inquiry') {
      const formValue = this.extraForms[formKey as keyof typeof this.extraForms].value;
      console.log(`${formKey === 'bugReport' ? 'Bug' : 'Inquiry'} Form Submitted`, formValue);
    }
  }

  onFileChange(event: any, type: 'document' | 'picture', roleKey: string) {
    const file: File = event.target.files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (file && allowedTypes.includes(file.type)) {
      this.uploadedFiles[roleKey][type] = file;
      this.careerForms[roleKey].get(type)?.setValue(true); // Set to true instead of file name
      console.log(`Uploaded ${type} for ${roleKey}:`, file);
    } else {
      alert('Only PDF, JPG, or PNG files are allowed!');
      event.target.value = ''; // Clear file input
    }
  }

  isCareerFormValid(roleKey: string): boolean {
    const form = this.careerForms[roleKey];
    return form.valid &&
      !!this.uploadedFiles[roleKey]?.['document'] &&
      !!this.uploadedFiles[roleKey]?.['picture'];
  }

}
