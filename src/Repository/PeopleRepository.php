<?php
namespace App\Repository;

use App\Entity\People;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PeopleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, People::class);
    }

    /**
     * @return array|Array
     */
    public function findAllOnlyName(): array
    {
        $entityManager = $this->getEntityManager();

        $result = $entityManager->createQuery(
            'SELECT P
            FROM App\Entity\People P'
        )->getResult();

        return $this->getOnlyName($result);
    }

    /**
     * @param array $array
     * @return Array
     */
    private function getOnlyName(Array $array): Array
    {
        $result = [];

        foreach($array as $people) {
            $name = $people->getFirstName() . ' ' . $people->getLastName();
            if ($name) {
                $result[$people->getId()] = $name;
            }
        }

        return $result;
    }
}