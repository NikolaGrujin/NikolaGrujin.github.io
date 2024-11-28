import * as THREE from 'three';

export class Billet
{
    constructor(type, deform_coeff, base_hardness, max_temp, colors, width, height, length)
    {
        this.type = type;
        this.deform_coeff = deform_coeff;
        this.hardness = base_hardness;

        this.width = width;
        this.height = height;
        this.length = length;

        this.temp = 0;
        this.max_temp = max_temp;

        this.colors = colors;

        this.material = new THREE.MeshStandardMaterial({color: 0xffffff});
        this.geometry = new THREE.BoxGeometry(this.width/5, this.height/5, this.length/5, this.width, this.height, this.length);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.pivot = new THREE.Object3D();
        this.pivot.add(this.mesh);

        this.heat(0);

        this.mesh.castShadow = true;
    }

    //Heating method for changing temperature of billet
    heat(delta_temp)
    {
        //Increment temperature property
        this.temp += delta_temp;
        this.temp = Math.min(Math.max(this.temp, 0), this.max_temp);
        let seq_alpha = this.temp / this.max_temp;
        let index = 0;

        for(let i = 0; i < this.colors.length - 1; i++)
        {
            if(this.colors[i][1]/this.max_temp <= seq_alpha && this.colors[i+1][1]/this.max_temp >= seq_alpha)
            {
                index = i;
            }
        }

        let lerp_alpha = (seq_alpha - (this.colors[index][1]/this.max_temp)) / ((this.colors[index+1][1]/this.max_temp) - (this.colors[index][1]/this.max_temp));
        this.material.color.lerpColors(this.colors[index][0], this.colors[index+1][0], lerp_alpha);
    }

    quench()
    {
        //TODO: implement quenching
    }

    moveTo(x, y, z)
    {
        this.pivot.position.set(x, y, z);
    }

    move(dx, dy, dz)
    {
        this.pivot.position.x += dx;
        this.pivot.position.y += dy;
        this.pivot.position.z += dz;
    }

    strike(strike_pos)
    {

    }
}