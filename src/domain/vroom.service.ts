import axios from 'axios';
import { VroomRequest } from '../models/vroom.model';

export class VroomService {
  private readonly vroomUrl: string;

  constructor(vroomUrl: string) {
    this.vroomUrl = vroomUrl;
  }

  async createTrip(request: VroomRequest) {
    const response = await axios.post(this.vroomUrl, request);

    console.log('Vroom API Response:', response.data);
  }
}
