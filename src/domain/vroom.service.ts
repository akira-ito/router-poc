import axios from 'axios';
import { VroomResponse } from '../models/vroom-response.model';
import { VroomRequest } from '../models/vroom.model';

export class VroomService {
  private readonly vroomUrl: string;

  constructor(vroomUrl: string) {
    this.vroomUrl = vroomUrl;
  }

  async createTrip(request: VroomRequest): Promise<VroomResponse> {
    const response = await axios.post(this.vroomUrl, request);

    return response.data as VroomResponse;
  }
}
