// login.component.ts
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') particleCanvas!: ElementRef<HTMLCanvasElement>;
  authForm: FormGroup;
  activeTab: 'login' | 'register' = 'login';
  errorMessage = '';
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationFrameId!: number;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: [''],
      lastName: ['']
    });
  }

  ngAfterViewInit() {
    this.initParticles();
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }

  private initParticles() {
    const canvas = this.particleCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d')!;
    this.particles = Array(100).fill(null).map(() => new Particle(canvas.width, canvas.height));
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.particleCanvas.nativeElement.width, this.particleCanvas.nativeElement.height);
    this.particles.forEach(p => p.update(this.ctx));
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.authForm.reset();
    this.errorMessage = '';
    
    if (tab === 'register') {
      this.authForm.addControl('firstName', this.fb.control('', Validators.required));
      this.authForm.addControl('lastName', this.fb.control('', Validators.required));
    } else {
      this.authForm.removeControl('firstName');
      this.authForm.removeControl('lastName');
    }
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const formValue = this.authForm.value;
    
    if (this.activeTab === 'login') {
      this.authService.login(formValue.email, formValue.password).subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => this.errorMessage = err.message
      });
    } else {
      this.authService.register(formValue).subscribe({
        next: () => {
          this.errorMessage = '';
          this.switchTab('login');
        },
        error: (err) => this.errorMessage = err.message
      });
    }
  }
}

class Particle {
  x!: number;
  y!: number;
  radius!: number;
  speed!: number;
  alpha!: number;

  constructor(private maxWidth: number, private maxHeight: number) {
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.maxWidth;
    this.y = Math.random() * this.maxHeight;
    this.radius = Math.random() * 2;
    this.speed = Math.random() * 0.5 + 0.2;
    this.alpha = Math.random() * 0.5 + 0.1;
  }

  update(ctx: CanvasRenderingContext2D) {
    this.y -= this.speed;
    if (this.y < 0) this.reset();
    
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}