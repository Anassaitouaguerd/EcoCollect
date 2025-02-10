import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { loadRequests } from '../../home/store/request.actions';
import { selectAllRequests } from '../../home/store/request.selectors';
import { Observable } from 'rxjs';
import { Request } from '../../../interfaces/request.interface';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') particleCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationFrameId: number = 0;
  private isBrowser: boolean;

  requests: Request[] = [];
  pendingRequestsCount = 0;
  processedRequestsCount = 0;

  constructor(
    private router: Router,
    private requestService: RequestService,
    @Inject(PLATFORM_ID) platformId: Object,
    private modalService: NgbModal
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.loadRequests();
  }

  get pendingRequests() {
    return this.requests.filter(request => request.status === 'pending');
  }

  private updateCounts() {
    this.pendingRequestsCount = this.requests.filter(r => r.status === 'pending').length;
    this.processedRequestsCount = this.requests.filter(r => r.status === 'in progress').length;
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initParticles();
      this.animate();
    }
  }

  ngOnDestroy() {
    if (this.isBrowser && this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initParticles() {
    const canvas = this.particleCanvas.nativeElement;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d');
    
    if (!this.ctx) return;
    
    this.particles = Array(100).fill(null).map(() => new Particle(canvas.width, canvas.height));
  }

  private animate() {
    if (!this.ctx || !this.particleCanvas) return;
    
    this.ctx.clearRect(0, 0, this.particleCanvas.nativeElement.width, this.particleCanvas.nativeElement.height);
    this.particles.forEach(p => p.update(this.ctx!));
    this.animationFrameId = window.requestAnimationFrame(() => this.animate());
  }

  onApproveRequest(requestId: string) {
    this.requestService.approveRequest(requestId).subscribe({
        next: (response) => {
            console.log('Request approved successfully');
            this.loadRequests();
            
            window.location.reload();
        },
        error: (error) => {
            console.error('Error approving request:', error);
        }
    });
}

  onRejectRequest(requestId: string) {
      this.requestService.rejectRequest(requestId).subscribe({
          next: (response) => {
              console.log('Request rejected successfully');
              this.loadRequests();
              window.location.reload();
          },
          error: (error) => {
              console.error('Error rejecting request:', error);
          }
      });
  }

  loadRequests() {
      this.requestService.getRequests().subscribe({
          next: (requests) => {
              this.requests = requests;
              this.updateCounts();
          },
          error: (error) => {
              console.error('Error loading requests:', error);
          }
      });
  }


  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCollectorName(): string {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).name : 'Collector';
  }
}

class Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  alpha: number;

  constructor(private maxWidth: number, private maxHeight: number) {
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.speed = 0;
    this.alpha = 0;
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
